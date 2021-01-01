import React, { FC, useEffect, useState } from "react";
import {
  ColorValue,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RNScrollViewProps extends ScrollViewProps {
  styles?: {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    underlayColor?: ColorValue;
  };
}

const RNScrollView: FC<RNScrollViewProps> = ({
  children,
  styles = {},
  ...rest
}) => {
  const { bottom } = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      {styles.underlayColor && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: styles.underlayColor },
          ]}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        {...rest}
        style={[defaultStyles.style, styles.style]}
        contentContainerStyle={[
          defaultStyles.contentContainerStyle,
          styles.contentContainerStyle,
          {
            // TODO: Resolve content jump
            paddingBottom: !keyboardOpen
              ? (styles.contentContainerStyle?.valueOf()["padding"] || 0) +
                bottom
              : 0,
          },
        ]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

RNScrollView.defaultProps = {
  styles: {
    underlayColor: "transparent",
  },
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  style: {
    backgroundColor: "#FFF",
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export default RNScrollView;
