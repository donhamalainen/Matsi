import { StyleSheet } from "react-native";
import { Text } from "@/components/Text";
import React from "react";
import { ScreenView } from "@/components/ScreenView";

const data = {
  name: "Pelaaja",
};
export default function ProfileScreen() {
  return (
    <ScreenView>
      <Text variant="title_small">Morjesta {data.name}!</Text>
    </ScreenView>
  );
}

const styles = StyleSheet.create({});
