import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import { getStorageItemAsync } from "@/utils/storage";
import { useAlarm } from "./useAlarm";
import {
  closeWebSocket,
  connectWebSocket,
  reconnectWebSocket,
} from "@/utils/websocket";

type AuthType = {
  onLogin: (email: string) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onVerify: (
    email: string,
    email_hash: string,
    token: string,
    valid_until: string
  ) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onLogout: () => void;
  session: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthType>({
  onLogin: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onVerify: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onLogout: () => {},
  session: null,
  isLoading: false,
});

const ENVIRONMENT: string = "home"; // ENVIRONMENT
// const WS_URL = "ws://localhost:443";
const API_URL =
  (ENVIRONMENT === "home" && "http://192.168.76.182:5001/api") ||
  (ENVIRONMENT === "phone" && "http://172.20.10.3:5001/api") ||
  (ENVIRONMENT === "school" && "http://130.231.3.84:5001/api");
console.log(ENVIRONMENT);

function useProtectedRoute(session: string | null) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const onboardingStatus = async () => {
      try {
        const onboardedStatus = await getStorageItemAsync("onboarded");
        if (!onboardedStatus) return router.replace("/(auth)/onboarding");
      } catch (error) {
        console.error("Virhe haettaessa onboard-tilaa:", error);
      }
    };

    onboardingStatus();
  }, []);

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) {
      router.replace("/(auth)/sign");
    } else if (session && inAuth) {
      router.replace("/(main)/home");
      reconnectWebSocket();
    }
  }, [session, segments]);
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const { showAlarm } = useAlarm();
  const [[isLoading, session], setSession] = useStorageState("session");

  useProtectedRoute(session);

  /**
   * Function is called when the user trying to login by using email address. The Function send the login link to the user email address
   * @param email
   * @returns
   */
  const onLogin = async (
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      const result = await axios.post(
        `${API_URL}/auth/send-login`,
        { email },
        {
          timeout: 5000, // 5 sekunnin aikakatkaisu
        }
      );
      if (result.data.error) {
        // Jos palvelin palauttaa virheen
        throw new Error(result.data.message);
      }
      return {
        success: true,
        message: "Kirjautumislinkki on lähetetty sähköpostiisi.",
      };
    } catch (error: any) {
      // Timeout-virhe
      if (error.message === "timeout of 5000ms exceeded") {
        showAlarm({
          type: "error",
          title: "Virhe",
          message: "Yhteysvirhe: palvelin ei vastaa. Yritä uudelleen.",
        });
        return {
          success: false,
          message: "Yhteysvirhe: palvelin ei vastaa.",
          error: true,
        };
      }

      // Palvelimen vastauksen virhe
      if (error.response) {
        const statusCode = error.response.status;

        // HTTP 400: Virheellinen pyyntö
        if (statusCode === 400) {
          showAlarm({
            type: "error",
            title: "Virhe",
            message: "Sähköpostiosoite on virheellinen tai puuttuu.",
          });
          return {
            success: false,
            message: "Sähköpostiosoite on virheellinen tai puuttuu.",
            error: true,
          };
        }

        // HTTP 500: Palvelinvirhe
        if (statusCode === 500) {
          showAlarm({
            type: "error",
            title: "Palvelinvirhe",
            message: "Palvelimella tapahtui virhe. Yritä myöhemmin uudelleen.",
          });
          return {
            success: false,
            message: "Palvelimella tapahtui virhe.",
            error: true,
          };
        }

        // Muu tunnettu virhe
        showAlarm({
          type: "error",
          title: "Virhe",
          message:
            error.response.data?.message || "Tuntematon virhe palvelimella.",
        });

        return {
          success: false,
          message:
            error.response.data?.message || "Tuntematon virhe palvelimella.",
          error: true,
        };
      }

      // Tuntematon virhe
      showAlarm({
        type: "error",
        title: "Virhe",
        message: "Odottamaton virhe, kokeile myöhemmin uudelleen.",
      });
      return {
        success: false,
        message: "Odottamaton virhe, kokeile myöhemmin uudelleen.",
        error: true,
      };
    }
  };

  /**
   * Function onVerify is method where we check the login link validity
   * @param email
   * @param token
   * @returns
   */
  const onVerify = async (
    email: string,
    email_hash: string,
    token: string,
    valid_until: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/email-login`, {
        email,
        email_hash,
        token,
        valid_until,
      });

      console.log(response);
      const authToken = response.data.authToken;
      await setSession(authToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      // Opening the WebSocket connection
      connectWebSocket({ token: authToken });

      return {
        success: true,
        message: "Kirjautuminen onnistui.",
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Kirjautuminen epäonnistui.";
      showAlarm({
        type: "error",
        title: "Virhe",
        message: errorMessage,
      });

      return {
        success: false,
        message: errorMessage,
        error: true,
      };
    }
  };

  /**
   * Function to logout the user and remove the session from the state
   */
  const onLogout = async () => {
    await setSession(null);
    delete axios.defaults.headers.common["Authorization"];
    closeWebSocket();
  };
  return (
    <AuthContext.Provider
      value={{
        onLogin,
        onLogout,
        onVerify,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
}
