import { StyleSheet, useWindowDimensions, View } from "react-native";
import React from "react";
import { OnboardingData } from "@/data/onboarding";
import { COLORS } from "@/constants/colors";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SCREEN_PADDING } from "@/constants/spacing";

type RenderItemProps = {
  item: OnboardingData;
  index: number;
  x: SharedValue<number>;
};

export const RenderItemOnBoarding = ({ item, index, x }: RenderItemProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Animoitu tyyli ympyrälle
  const pageAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH, // Edellinen sivu
        index * SCREEN_WIDTH, // Nykyinen sivu
        (index + 1) * SCREEN_WIDTH, // Seuraava sivu
      ],
      [1, 4, 4], // Skaalaa sisääntulosta suureksi ja pienemmäksi
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const textColor = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [COLORS.onBoardFirst, COLORS.onBoardSecond, COLORS.onBoardThird]
    );
    return {
      color: textColor,
    };
  });
  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              backgroundColor: item.backgroundColor,
              borderRadius: SCREEN_WIDTH / 2,
            },
            pageAnimation,
          ]}
        />
      </View>

      <Animated.Text style={[textColor, styles.title]}>
        {item.title}
      </Animated.Text>
      <Animated.Text style={[textColor, styles.desc]}>
        {item.description}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_PADDING,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "ChillaxMedium",
    fontSize: 32,
  },
  desc: {
    fontSize: 20,
    fontFamily: "GeneralSansRegular",
  },
});
