import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { ScreenView } from "@/components/ScreenView";
import { useAuth } from "@/context/useAuth";
import { useLoading } from "@/context/useLoading";
import { useAlarm } from "@/context/useAlarm";
import { Text } from "@/components/Text";
import { COLORS } from "@/constants/colors";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { BORDER_RADIUS } from "@/constants/sizing";
import { router } from "expo-router";

const EmailIndex = () => {
  const { onLogin } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { showAlarm } = useAlarm();
  const [email, setEmail] = useState<string>("");

  const handleEmailCheck = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async () => {
    if (!email) {
      showAlarm({
        type: "error",
        title: "Virhe",
        message: "Vaaditaan sähköpostiosoite.",
      });
      return;
    }

    const isValidEmail = handleEmailCheck(email);
    if (!isValidEmail) {
      showAlarm({
        type: "error",
        title: "Virhe",
        message: "Sähköpostiosoite ei ole kelvollinen.",
      });
      return;
    }

    showLoading();

    try {
      const result = await onLogin(email);
      if (result.success) {
        // Jos `onLogin` onnistuu, siirretään käyttäjä email verifiointi sivulle
        router.push("/(auth)/email/verify");
      } else {
        showAlarm({
          type: "error",
          title: "Virhe",
          message: result.message,
        });
      }
    } catch (error: any) {
      showAlarm({
        type: "error",
        title: "Virhe",
        message: "Odottamaton virhe. Kokeile myöhemmin uudelleen.",
      });
    } finally {
      hideLoading();
    }
  };
  return (
    <ScreenView>
      <KeyboardAvoid style={{ justifyContent: "space-between" }}>
        <View style={styles.contentContainer}>
          <Text variant="title">Kirjaudu sisään helposti ja nopeasti</Text>
          <Text variant="body">
            Lähetämme sinulle kirjautumislinkin antamaasi
            sähköpostiosoitteeseen. Näin voimme todentaa henkilöllisyytesi ja
            pitää sovelluksen turvallisena kaikille.
          </Text>

          <TextInput
            placeholder="Anna sähköpostiosoite"
            placeholderTextColor={COLORS.white}
            value={email}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <Text variant="body" style={styles.buttonText}>
              Lähetä
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoid>
    </ScreenView>
  );
};

export default EmailIndex;

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    flex: 1,
    justifyContent: "center",
  },

  input: {
    backgroundColor: COLORS.black,
    padding: 20,
    borderWidth: 1,
    color: COLORS.white,
    borderRadius: BORDER_RADIUS,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: COLORS.lightBackground,
    borderRadius: BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "ChillaxMedium",
  },
});
