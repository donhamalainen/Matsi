import { Stack, Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Aula",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Käyttäjä",
        }}
      />
      {/* <Stack.Screen name="Profile" />
      <Stack.Screen name="Settings" /> */}
    </Tabs>
  );
}
