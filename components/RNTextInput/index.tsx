import React, { FC, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";

interface RNTextInputProps extends TextInputProps {
  styles?: {
    input?: StyleProp<TextStyle>;
  };
}

const RNTextInput: FC<RNTextInputProps> = ({ styles }) => {
  const [value, setValue] = useState("");

  return (
    <TextInput
      style={[defaultStyles.input, styles?.input]}
      onChangeText={(text) => setValue(text)}
      value={value}
    />
  );
};

RNTextInput.defaultProps = {
  styles: {},
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 56,
    borderColor: "#DDD",
    borderRadius: 40,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});

export default RNTextInput;
