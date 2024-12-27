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
    otp: string
  ) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onAppleLogin: (identityToken: string) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onLogout: () => void;
  session: string | null;
  isLoading: boolean;
};

const NETWORK = "home";
const API_URL =
  // "http://192.168.76.182:3000/api"
  "http://172.20.10.2:3000/api";

console.log(API_URL);
const AuthContext = createContext<AuthType>({
  onLogin: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onVerify: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onAppleLogin: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onLogout: () => {},
  session: null,
  isLoading: false,
});

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

  useProtectedRoute(session);

  const onLogin = async (
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      // Lähetä kirjautumispyyntö backendille
      await axios.post(`${API_URL}/auth/request`, {
        email,
      });

      return {
        success: true,
        message: "OTP on lähetetty sähköpostiisi. Tarkista postilaatikkosi.",
      };
    } catch (error: any) {
      // Tarkistetaan verkko-ongelma
      if (!error.response) {
        showAlarm({
          type: "error",
          title: "Verkkovirhe",
          message: "Ei yhteyttä palvelimeen. Tarkista verkkoyhteytesi.",
        });
      }
      // Tarkistetaan 500 (palvelinvirhe)
      else if (error.response.status === 500) {
        showAlarm({
          type: "error",
          title: "Palvelinvirhe",
          message: "Palvelimella tapahtui virhe. Yritä myöhemmin uudelleen.",
        });
      }
      // Muu virhe
      else {
        showAlarm({
          type: "error",
          title: "Tuntematon virhe",
          message:
            error.response?.data?.message ||
            "Jokin meni pieleen. Tarkista yhteytesi ja yritä uudelleen.",
        });
      }
      return {
        success: false,
        message: "Virhe Sähköposti-kirjautumisessa",
        error: true,
      };
    }
  };
  const onVerify = async (
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      // Lähetä kirjautumispyyntö backendille
      const result = await axios.post(`${API_URL}/auth/verify`, {
        email,
        otp,
      });

      const { token, user } = result.data;
      console.log({
        token,
        id: user.id,
        username: user.username,
        created: user.created_at,
        updated: user.updated_at,
      });
      setTimeout;
      await setSession(token);
      // Aseta Axiosin oletuspääotsikko, jotta kaikki pyynnöt ovat autentikoituja
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, message: "Kirjautuminen onnistui" };
    } catch (error: any) {
      let errorMessage =
        "Jokin meni pieleen. Tarkista yhteytesi ja yritä uudelleen.";

      console.error("OTP verification failed:", error.message);

      if (error.response) {
        // Backendin palauttama virhekoodi
        const status = error.response.status;
        switch (status) {
          case 401:
            errorMessage =
              "Vahvistuskoodi on väärin tai vanhentunut. Yritä uudelleen tai ota yhteyttä tukeen";
            break;
          case 500:
            errorMessage =
              "Palvelimessa tapahtui virhe. Yritä myöhemmin uudelleen.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
            break;
        }
      } else if (error.message === "Network Error") {
        // Verkko-ongelmat
        errorMessage =
          "Verkkoyhteys epäonnistui. Tarkista internet-yhteys tai tarkista osoitteesta www.boggo.fi/matsi palvelimien tilanne";
      }

      // Näytä hälytys
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
  const onAppleLogin = async (
    identityToken: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      const result = await axios.post(`${API_URL}/auth/apple`, {
        identityToken,
      });
      const { token } = result.data;

      console.log(result);
      // Jos kirjautuminen onnistui
      await setSession(token);
      // Aseta Axiosin oletuspääotsikko, jotta kaikki pyynnöt ovat autentikoituja
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { success: true, message: "Kirjautuminen onnistui" };
    } catch (error: any) {
      // Tarkistetaan verkko-ongelma
      if (!error.response) {
        showAlarm({
          type: "error",
          title: "Verkkovirhe",
          message: "Ei yhteyttä palvelimeen. Tarkista verkkoyhteytesi.",
        });
      }
      // Tarkistetaan 500 (palvelinvirhe)
      else if (error.response.status === 500) {
        showAlarm({
          type: "error",
          title: "Palvelinvirhe",
          message: "Palvelimella tapahtui virhe. Yritä myöhemmin uudelleen.",
        });
      }
      // Muu virhe
      else {
        showAlarm({
          type: "error",
          title: "Tuntematon virhe",
          message:
            error.response?.data?.message ||
            "Jokin meni pieleen. Tarkista yhteytesi ja yritä uudelleen.",
        });
      }
      return {
        success: false,
        message: "Virhe Apple-kirjautumisessa",
        error: true,
      };
    }
  };
  const onLogout = async () => {
    await setSession(null);
    delete axios.defaults.headers.common["Authorization"];
  };
  return (
    <AuthContext.Provider
      value={{
        onLogin,
        onLogout,
        onAppleLogin,
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
