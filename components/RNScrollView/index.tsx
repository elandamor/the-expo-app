import React, { FC, useEffect, useState } from "react";
import {
  ColorValue,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RNScrollViewProps {
  enablePullToRefresh?: boolean;
  refreshing?: boolean;
  styles?: {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    underlayColor?: ColorValue;
  };
  onRefresh?: () => void;
}

const RNScrollView: FC<RNScrollViewProps> = ({
  enablePullToRefresh,
  children,
  refreshing: controlledRefreshing,
  styles = {},
  onRefresh,
}) => {
  const { bottom } = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(controlledRefreshing);

  useEffect(() => {
    if (controlledRefreshing != undefined) {
      setRefreshing(!!controlledRefreshing);
    }
  }, [controlledRefreshing]);

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
        {...(enablePullToRefresh && {
          refreshControl: (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={() => {
                if (onRefresh) {
                  setRefreshing(true);
                  onRefresh();
                }
              }}
            />
          ),
        })}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

RNScrollView.defaultProps = {
  enablePullToRefresh: false,
  refreshing: false,
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
