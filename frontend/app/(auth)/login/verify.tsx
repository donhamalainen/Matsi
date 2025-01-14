import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "@/components/Text";
import { ScreenView } from "@/components/ScreenView";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
const EmailVerify = () => {
  const url = Linking.useURL();
  const router = useRouter();
  if (url) {
    const { queryParams } = Linking.parse(url);
    console.log(`Linked to app with data: ${JSON.stringify(queryParams)}`);
  }
  return (
    <ScreenView style={styles.container}>
      <View style={styles.header}>
        <Text variant="title" style={styles.title}>
          Sähköpostiosoite lähetetty!
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:")}>
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

// http://localhost:3000/email-login?login_link=matsi-app%3A%2F%2Flogin%3Femail%3Dhamalainen.don%2540gmail.com%26email_hash%3D%25242b%252410%25245J.liZpxSu9tIYRspj4S1O9RpbXF3iOvHE5snsMc8oznbxgm8%252F0JO%26token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbWFsYWluZW4uZG9uQGdtYWlsLmNvbSIsImlhdCI6MTczNjE3NTEzMywiZXhwIjoxNzM2MTc2MDMzfQ.pJ1NoimComR53s3UgIfDm1kcs2afjNk0WNQRZbjUkDc%26valid_until%3D2025-01-06T15%253A07%253A13.338Z&universal=true
// exp://192.168.76.182:8081/%3A%2F%2Femail%2Fverify%3Femail%3Dhamalainen.don%2540gmail.com%26email_hash%3D%25242b%252410%2524DiDOlfGJkVUctiZNgmPaPedrsl.CImcmFegsOoxjS4nXboyCMWlvm%26token%3DeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbWFsYWluZW4uZG9uQGdtYWlsLmNvbSIsImlhdCI6MTczNjM5NzE5OSwiZXhwIjoxNzM2Mzk4MDk5fQ.AoIo2MjkII_CUMdPUQ0shJGGfgui4e8Ht7l0QPfQc-4%26valid_until%3D2025-01-09T04%253A48%253A19.413Z
