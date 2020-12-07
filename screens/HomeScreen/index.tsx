import { addDays, format, startOfWeek } from "date-fns";
import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNAgenda } from "../../components";

const generateWeekdays = (
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined = 0
) => {
  const firstDOW = startOfWeek(new Date(), { weekStartsOn: firstDayOfWeek });
  const shortWeekDaysArray = Array.from(Array(7)).map((e, i) =>
    format(addDays(firstDOW, i), "EEE")
  );

  return shortWeekDaysArray;
};

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    backgroundColor: "#DDD",
    borderBottomRightRadius: 44,
    minHeight: 56 + Constants.statusBarHeight,
    width: width,
  },
});

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const weekDaysNames = generateWeekdays();
  console.log({ weekDaysNames });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <RNAgenda
          items={{
            "2020-12-07": [{ name: "item 1 - any js object" }],
            "2020-12-08": [{ name: "item 2 - any js object", height: 80 }],
            "2020-12-09": [],
            "2020-12-10": [],
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
