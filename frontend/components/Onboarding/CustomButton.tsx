import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
  AnimatedRef,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { OnboardingData } from "@/data/onboarding";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { setStorageItemAsync } from "@/utils/storage";

type CustomButtonProps = {
  dataLength: number;
  flatlistIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<OnboardingData>>;
  x: SharedValue<number>;
};

export const CustomButton = ({
  dataLength,
  flatListRef,
  flatlistIndex,
  x,
}: CustomButtonProps) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatlistIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });
  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [COLORS.onBoardFirst, COLORS.onBoardSecond, COLORS.onBoardThird]
    );
    return {
      backgroundColor: backgroundColor,
    };
  });
  // Animaatiotyyli nuolen näkyvyydelle
  const arrowStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatlistIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatlistIndex.value === dataLength - 1
              ? withTiming(-20)
              : withTiming(0),
        },
      ],
    };
  });
  // Animaatiotyyli tekstin näkyvyydelle
  const textStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatlistIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
    };
  });

  const saveOnboardingStatus = async () => {
    try {
      await setStorageItemAsync("onboarded", "true");
    } catch (error) {
      console.error("Virhe tallentamisessa onboard-tilaa:", error);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (flatlistIndex.value < dataLength - 1) {
          flatListRef.current?.scrollToIndex({
            index: Math.min(flatlistIndex.value + 1, dataLength - 1),
            animated: true,
          });
        } else {
          saveOnboardingStatus();
          router.replace("/(auth)/sign");
        }
      }}
    >
      <Animated.View
        style={[styles.buttonContainer, animatedColor, buttonAnimationStyle]}
      >
        <Animated.Text style={[styles.text, textStyle]}>Shelkis!</Animated.Text>
        <Animated.View style={[styles.arrowContainer, arrowStyle]}>
          <AntDesign name="right" size={24} color="white" />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.black,
    padding: 10,
    borderRadius: 30,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  arrowContainer: {
    position: "absolute",
  },
  text: {
    fontFamily: "ChillaxMedium",
    color: COLORS.white,
    fontSize: 16,
  },
});
