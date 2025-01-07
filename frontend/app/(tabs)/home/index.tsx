import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@/context/useAuth";
import { ScreenView } from "@/components/ScreenView";

export default function HomeScreen() {
  const { onLogout } = useAuth();
  return (
    <ScreenView>
      <Text>HomeScreenHomeScreenHomeScreen</Text>
      <Pressable onPress={() => onLogout()}>
        <Text>Kirjaudu ulos</Text>
      </Pressable>
    </ScreenView>
  );
}
