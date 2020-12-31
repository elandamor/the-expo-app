import format from "date-fns/format";
import isWithinInterval from "date-fns/isWithinInterval";
import memoizeOne from "memoize-one";
import React, { FC, useEffect, useRef } from "react";
import { Animated, Text, View, VirtualizedList } from "react-native";
import RNScrollView from "../RNScrollView";
import styles from "./styles";
import Times from "./Times";
import { CONTAINER_WIDTH, TIME_LABELS_IN_DISPLAY } from "./utils";

const MINUTES_IN_DAY = 60 * 24;

interface RNWeekViewProps {
  events: any[];
  hoursInDisplay?: number;
  numberOfColumns?: number;
}

const RNWeekView: FC<RNWeekViewProps> = ({
  events,
  hoursInDisplay,
  numberOfColumns = 2,
}) => {
  const initialHeaders = ["Wanda", "Zizipho", "Abbi", "Thando", "Kayleen"];
  const headerRef = useRef<any>(null);
  const eventsGridScrollX = new Animated.Value(0);

  const getListItemLayout = (index: number) => ({
    length: CONTAINER_WIDTH,
    offset: CONTAINER_WIDTH * index,
    index,
  });

  const calculateTimes = memoizeOne((hoursInDisplay) => {
    const times = [];
    const timeLabelsPerHour = TIME_LABELS_IN_DISPLAY / hoursInDisplay;
    const minutesStep = 60 / timeLabelsPerHour;

    for (let timer = 0; timer < MINUTES_IN_DAY; timer += minutesStep) {
      const minutes = timer % 60;
      const hour = Math.floor(timer / 60);

      const formattedDate = format(new Date(), "yyyy-MM-dd");
      const formattedTime = `${hour < 10 ? "0" + hour : hour}:0${minutes}`;

      const dateTime = `${formattedDate}T${formattedTime}`;

      times.push(dateTime);
    }

    return times;
  });

  const times = calculateTimes(hoursInDisplay)
    .filter((dateTime) => {
      const formattedDate = format(new Date(), "yyyy-MM-dd");

      return isWithinInterval(new Date(dateTime), {
        start: new Date(`${formattedDate}T08:00`),
        end: new Date(`${formattedDate}T17:00`),
      });
    })
    .map((time) => format(new Date(time), "h aaaa"));

  useEffect(() => {
    eventsGridScrollX.addListener((position) => {
      headerRef?.current?.scrollToOffset({
        offset: position.value,
        animated: false,
      });
    });

    return () => eventsGridScrollX.removeAllListeners();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingLeft: 64 }]}>
        <VirtualizedList
          ref={headerRef}
          style={{
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#8C8C8C",
          }}
          contentContainerStyle={{ height: 50 }}
          scrollEnabled={false}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={initialHeaders}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          getItemLayout={(_, index) => getListItemLayout(index)}
          keyExtractor={(item) => item}
          renderItem={({ item: title }: { item: string }) => {
            return (
              <View
                key={title}
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  width: CONTAINER_WIDTH / (numberOfColumns as number),
                  borderRightWidth: 1,
                  borderColor: "#8C8C8C",
                }}
              >
                <Text>{title}</Text>
              </View>
            );
          }}
        />
      </View>
      <RNScrollView>
        <View style={styles.scrollViewContent}>
          <Times times={times} textStyle={{ color: "#8C8C8C" }} />
          <VirtualizedList
            style={{ borderLeftWidth: 1, borderColor: "#8C8C8C" }}
            data={initialHeaders}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            getItemLayout={(_, index) => getListItemLayout(index)}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: string }) => {
              return (
                <View
                  key={item}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    width: CONTAINER_WIDTH / (numberOfColumns as number),
                    borderRightWidth: 1,
                    borderColor: "#8C8C8C",
                  }}
                ></View>
              );
            }}
            horizontal
            pagingEnabled
            scrollEventThrottle={32}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: eventsGridScrollX,
                    },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
          />
        </View>
      </RNScrollView>
    </View>
  );
};

RNWeekView.defaultProps = {
  events: [],
  hoursInDisplay: 12,
};

export default RNWeekView;
