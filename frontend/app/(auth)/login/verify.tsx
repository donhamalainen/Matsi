import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/Text";
import { ScreenView } from "@/components/ScreenView";
import * as Linking from "expo-linking";
import { useAlarm } from "@/context/useAlarm";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/useAuth";
import { useLoading } from "@/context/useLoading";
const EmailVerify = () => {
  const { showAlarm } = useAlarm();
  const { showLoading, hideLoading } = useLoading();
  const { onVerify } = useAuth();
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);
      const email = queryParams?.email as string;
      const emailHash = queryParams?.email_hash as string;
      const token = queryParams?.token as string;
      const validUntil = queryParams?.valid_until as string;
      if (email && emailHash && token && validUntil) {
        showLoading();
        handleVerify({ email, emailHash, token, validUntil });
      }
    }
  }, [url]);

  const handleVerify = async ({
    email,
    emailHash,
    token,
    validUntil,
  }: {
    email: string;
    emailHash: string;
    token: string;
    validUntil: string;
  }) => {
    try {
      const result = await onVerify(email, emailHash, token, validUntil);
      if (result.success) {
        showAlarm({
          type: "success",
          title: "Onnistunut",
          message: "Olet kirjautunut sisään onnistuneesti!",
        });
        router.replace("/(main)/home");
      } else {
        router.replace("/(auth)/sign");
        showAlarm({
          type: "error",
          title: "Kirjautumisvirhe",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Virhe vahvistamisessa:", error);
      showAlarm({
        type: "error",
        title: "Virhe",
        message: "Kirjautumisen vahvistaminen epäonnistui.",
      });
      router.replace("/(auth)/sign");
    } finally {
      hideLoading();
    }
  };

  const handleOpenMail = () => {
    Linking.canOpenURL("message:").then((supported) => {
      if (!supported) {
        showAlarm({
          type: "error",
          title: "Virhe",
          message: "Emme löytäneet sähköpostisovellusta laitteeltasi",
        });
      } else {
        return Linking.openURL("message:");
      }
    });
  };
  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <Text variant="title" style={styles.title}>
          Sähköpostiosoite lähetetty!
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleOpenMail()}>
          <Text>Tarkista sähköpostisi ja vahvista kirjautuminen.</Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
};

export default EmailVerify;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {},
  title: {
    fontSize: 24,
  },
  footer: {},
});
