import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import { getStorageItemAsync } from "@/utils/storage";
import { useAlarm } from "./useAlarm";

type AuthType = {
  onLogin: (email: string) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onVerify: (
    email: string,
    token: string
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

const API_URL = "http://172.20.10.3:5001/api";
// phone : http://172.20.10.3/
const WS_URL = "ws://localhost:443";

// console.log(API_URL);

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
      router.replace("/(tabs)/home");
    }
  }, [session, segments]);
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const { showAlarm } = useAlarm();
  const [[isLoading, session], setSession] = useStorageState("session");
  let ws: WebSocket | null = null;

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
      await axios.post(`${API_URL}/auth/send-login`, { email });
      return {
        success: true,
        message: "Kirjautumislinkki on lähetetty sähköpostiisi.",
      };
    } catch (error: any) {
      showAlarm({
        type: "error",
        title: "Virhe",
        message: error.response?.data?.message || "Kirjautuminen epäonnistui.",
      });
      return {
        success: false,
        message: "Kirjautuminen epäonnistui",
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
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      const response = await axios.post(`${API_URL}/auth/email-login`, {
        email,
        token,
      });

      const authToken = response.data.authToken;
      await setSession(authToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

      // Opening the WebSocket connection
      // Luo WebSocket-yhteys
      ws = connectWebSocket();

      return {
        success: true,
        message: "Kirjautuminen onnistui.",
      };
    } catch (error: any) {
      showAlarm({
        type: "error",
        title: "Virhe",
        message: error.response?.data?.message || "Kirjautuminen epäonnistui.",
      });
      return {
        success: false,
        message: "Kirjautuminen epäonnistui",
        error: true,
      };
    }
  };

  /**
   * Luo WebSocket-yhteys JWT-tokenin avulla
   */
  const connectWebSocket = (): WebSocket | null => {
    if (!session) {
      showAlarm({
        type: "error",
        title: "WebSocket-virhe",
        message: "Käyttäjän istunto puuttuu. Kirjaudu sisään uudelleen.",
      });
      return null;
    }

    const ws = new WebSocket(WS_URL, ["authorization", `Bearer ${session}`]);

    ws.onopen = () => {
      console.log("WebSocket-yhteys avattu.");
    };

    ws.onmessage = (event) => {
      console.log("Viestisaapunut:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket-yhteys suljettu.");
      showAlarm({
        type: "warning",
        title: "WebSocket-yhteys suljettu",
        message: "Yhteys palvelimeen katkesi.",
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket-virhe:", error);
      showAlarm({
        type: "error",
        title: "WebSocket-virhe",
        message: "Yhteyden muodostaminen epäonnistui.",
      });
    };

    return ws;
  };

  /**
   * Function to logout the user and remove the session from the state
   */
  const onLogout = async () => {
    await setSession(null);
    delete axios.defaults.headers.common["Authorization"];
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
