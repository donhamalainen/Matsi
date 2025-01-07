import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Text } from "../Text";
import * as AppleAuthentication from "expo-apple-authentication";
import Svg, { G, Path } from "react-native-svg";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/useAuth";

const AppleAuth = () => {
  const { onAppleLogin } = useAuth();
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      const { identityToken } = credential;

      if (!identityToken) {
        throw new Error("Identity token puuttuu.");
      }

      await onAppleLogin(identityToken);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        console.log("Käyttäjä peruutti kirjautumisen.");
      } else {
        console.error("Apple kirjautumisessa tapahtui virhe:", error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={handleAppleSignIn}
    >
      <Svg width={24} height={24} viewBox="0 0 20 26" style={styles.icon}>
        <G>
          <Path
            d="M14.7363 6.03516C12.8516 6.03516 11.3281 7.17773 10.3418 7.17773C9.29688 7.17773 7.92969 6.03516 6.28906 6.03516C3.18359 6.03516 0.0292969 8.67188 0.0292969 13.5156C0.0292969 16.543 1.19141 19.7266 2.63672 21.7773C3.87695 23.5156 4.95117 24.9219 6.51367 24.9219C8.05664 24.9219 8.73047 23.9258 10.6445 23.9258C12.5977 23.9258 13.0273 24.9219 14.7363 24.9219C16.4258 24.9219 17.5488 23.3789 18.6133 21.8457C19.8047 20.0977 20.3027 18.3887 20.3125 18.3105C20.2148 18.2715 16.9824 16.9531 16.9824 13.2617C16.9824 10.0586 19.5312 8.62305 19.668 8.51562C17.998 6.10352 15.4395 6.03516 14.7363 6.03516ZM13.8477 3.99414C14.6191 3.05664 15.166 1.78711 15.166 0.498047C15.166 0.322266 15.1562 0.146484 15.1172 0C13.8672 0.0488281 12.3535 0.839844 11.4551 1.9043C10.7422 2.70508 10.0879 3.99414 10.0879 5.2832C10.0879 5.46875 10.1172 5.66406 10.1367 5.73242C10.2148 5.74219 10.3418 5.76172 10.4688 5.76172C11.6016 5.76172 13.0176 5.00977 13.8477 3.99414Z"
            fill="white"
          />
        </G>
      </Svg>

      <Text variant="body" style={styles.buttonText}>
        Jatka Applella
      </Text>
    </TouchableOpacity>
  );
};

export default AppleAuth;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 50,
  },
  icon: {
    position: "absolute",
    left: 20,
  },
  buttonText: {
    fontFamily: "GeneralSansMedium",
    color: COLORS.white,
    textAlign: "center",
    flex: 1,
    fontSize: 16,
  },
});
