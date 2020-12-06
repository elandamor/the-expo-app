import React, { FC } from "react";
import { ButtonProps, Pressable, StyleSheet, Text, View } from "react-native";

interface RNButtonProps extends ButtonProps {}

const RNButton: FC<RNButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[defaultStyles.button]}>
        <Text style={[defaultStyles.buttonText]}>{title}</Text>
      </View>
    </Pressable>
  );
};

RNButton.defaultProps = {};

const defaultStyles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 56,
    height: 64,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default RNButton;
