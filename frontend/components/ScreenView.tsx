import {
  Keyboard,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { SCREEN_PADDING, SCREEN_PADDING_BOTTOM } from "@/constants/spacing";

type ScreenAreaProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  topInsets?: boolean;
};

export const ScreenView = ({ children, style }: ScreenAreaProps) => {
  const insets = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          style,
          {
            paddingTop: insets.top + 20,
            flex: 1,
            backgroundColor: COLORS.background,
            paddingHorizontal: SCREEN_PADDING,
            paddingBottom: SCREEN_PADDING_BOTTOM,
          },
        ]}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};
