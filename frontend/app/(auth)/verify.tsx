import { Keyboard, StyleSheet, View } from "react-native";
import React from "react";
import { ScreenView } from "@/components/ScreenView";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/useAuth";
import { useAlarm } from "@/context/useAlarm";
import { Text } from "@/components/Text";
import VerifyInput from "@/components/VerifyInput";

export default function Verify() {
  const { showAlarm } = useAlarm();
  const { onVerify } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  // const router = useRouter();

  const handleComplete = async (otp: string) => {
    if (otp.length === 6) {
      await onVerify(email, otp);
    } else {
      showAlarm({
        type: "warning",
        message: "Ole hyvä ja syötä 6-numeroinen vahvistuskoodi.",
        title: "Etkö sä osaa?",
      });
    }
  };
  return (
    <ScreenView>
      <View style={styles.header}>
        <Text variant="title">Anna vahvistuskoodi</Text>
        <Text variant="bodyLarge">
          Tämä auttaa meitä varmistamaan henkilöllisyytesi ja suojaamaan tilisi.
        </Text>
      </View>
      <View style={styles.verifyContainer}>
        <Text variant="bodyLarge">
          Vahvistuskoodi on lähetetty {email} ja se on voimassa 60 sekunttia
        </Text>
        <VerifyInput onComplete={(otp) => handleComplete(otp)} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 10,
  },
  verifyContainer: {
    flex: 0.5,
    justifyContent: "center",
    gap: 20,
  },
});
