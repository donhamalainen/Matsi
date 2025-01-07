import { StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";

type DotProps = {
  index: number;
  x: SharedValue<number>;
};

export const Dot = ({ index, x }: DotProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];
  const extrapolation = Extrapolation.CLAMP;

  const animatedDot = useAnimatedStyle(() => {
    const width = interpolate(x.value, inputRange, [10, 20, 10], extrapolation);
    const opacity = interpolate(
      x.value,
      inputRange,
      [0.5, 1, 0.5],
      extrapolation
    );
    return {
      width,
      opacity,
    };
  });

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [COLORS.onBoardFirst, COLORS.onBoardSecond, COLORS.onBoardThird]
    );
    return {
      backgroundColor,
    };
  });
  return <Animated.View style={[styles.dot, animatedColor, animatedDot]} />;
};

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
