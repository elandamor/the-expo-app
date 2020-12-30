import React from "react";
import { Text, View } from "react-native";
import { TIME_LABEL_HEIGHT } from "../utils";
import styles from "./Times.styles";

const Times = ({ times, textStyle }) => {
  return (
    <View style={styles.columnContainer}>
      {times.map((time) => (
        <View key={time} style={[styles.label, { height: TIME_LABEL_HEIGHT }]}>
          <Text style={[styles.text, textStyle]}>{time}</Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(Times);
