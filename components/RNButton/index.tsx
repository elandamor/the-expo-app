import React, { FC } from "react";
import {
  ButtonProps,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {} from "styled-system";

interface RNButtonProps extends ButtonProps {
  styles?: {
    button?: StyleProp<ViewStyle>;
    buttonTitle?: StyleProp<TextStyle>;
  };
  variant?: "default" | "primary";
}

const RNButton: FC<RNButtonProps> = ({ title, onPress, styles, variant }) => {
  let variantStyles: {
    button?: StyleProp<ViewStyle>;
    buttonTitle?: StyleProp<TextStyle>;
  } = {};

  switch (variant) {
    case "primary":
      variantStyles = {
        button: { backgroundColor: "#000" },
        buttonTitle: { color: "#FFF" },
      };
      break;
    default:
      variantStyles = {
        button: { backgroundColor: "#F9F9F9" },
        buttonTitle: { color: "#222" },
      };
      break;
  }

  return (
    <Pressable onPress={onPress}>
      <View
        style={[defaultStyles.button, variantStyles.button, styles?.button]}
      >
        <Text
          style={[
            defaultStyles.buttonTitle,
            variantStyles.buttonTitle,
            styles?.buttonTitle,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

RNButton.defaultProps = {
  variant: "default",
};

const defaultStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 56,
    height: 64,
    justifyContent: "center",
  },
  buttonTitle: {
    fontSize: 16,
  },
});

export default RNButton;
