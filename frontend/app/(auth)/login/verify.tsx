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
    console.log(`
      email: ${email}
      emailHash: ${emailHash}
      token: ${token}
      validUntil: ${validUntil}
      `);
    try {
      const result = await onVerify(email, token, emailHash, validUntil);
      if (result.success) {
        router.navigate("/(main)/home");
      }
    } catch (error) {
      console.error("Virhe vahvistamisessa:", error);
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

function showLoading() {
  throw new Error("Function not implemented.");
}

function hideLoading() {
  throw new Error("Function not implemented.");
}

function showAlarm(arg0: string, arg1: number) {
  throw new Error("Function not implemented.");
}
// http://localhost:3000/email-login?login_link=matsi-app%3A%2F%2Flogin%3Femail%3Dhamalainen.don%2540gmail.com%26email_hash%3D%25242b%252410%25245J.liZpxSu9tIYRspj4S1O9RpbXF3iOvHE5snsMc8oznbxgm8%252F0JO%26token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbWFsYWluZW4uZG9uQGdtYWlsLmNvbSIsImlhdCI6MTczNjE3NTEzMywiZXhwIjoxNzM2MTc2MDMzfQ.pJ1NoimComR53s3UgIfDm1kcs2afjNk0WNQRZbjUkDc%26valid_until%3D2025-01-06T15%253A07%253A13.338Z&universal=true
// exp://192.168.76.182:8081/%3A%2F%2Femail%2Fverify%3Femail%3Dhamalainen.don%2540gmail.com%26email_hash%3D%25242b%252410%2524DiDOlfGJkVUctiZNgmPaPedrsl.CImcmFegsOoxjS4nXboyCMWlvm%26token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbWFsYWluZW4uZG9uQGdtYWlsLmNvbSIsImlhdCI6MTczNjM5NzE5OSwiZXhwIjoxNzM2Mzk4MDk5fQ.AoIo2MjkII_CUMdPUQ0shJGGfgui4e8Ht7l0QPfQc-4%26valid_until%3D2025-01-09T04%253A48%253A19.413Z
