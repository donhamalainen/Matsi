import { StyleSheet, TextInput, View } from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "@/constants/colors";
import { SCREEN_PADDING } from "@/constants/spacing";

type VerifyInputProps = {
  onComplete: (otp: string) => void;
  length?: number;
};
const VerifyInput = ({ onComplete, length = 6 }: VerifyInputProps) => {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== "" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (index === length - 1 && text !== "") {
      onComplete(newOtp.join(""));
    }
  };

  const handleFocus = (index: number) => setFocusedIndex(index);

  return (
    <View style={styles.inputContainer}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          value={otp[index]}
          ref={(el) => (inputs.current[index] = el)}
          style={[styles.input, focusedIndex === index && styles.focusedInput]}
          inputMode="numeric"
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChange(text, index)}
          onFocus={() => handleFocus(index)}
          onKeyPress={({ nativeEvent: { key } }) => {
            if (key === "Backspace" && index > 0) {
              handleChange("", index - 1);
              inputs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </View>
  );
};

export default VerifyInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: COLORS.inputText,
  },
  input: {
    width: 50,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.black,
    textAlign: "center",
    fontSize: 18,
    color: COLORS.black,
  },
});
