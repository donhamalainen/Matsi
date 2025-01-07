import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import React from "react";

type KeyboardAvoidProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
};
const KeyboardAvoid = ({
  children,
  style,
  keyboardVerticalOffset = 20,
}: KeyboardAvoidProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[style, { flex: 1 }]}
      enabled
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoid;
