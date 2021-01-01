import format from "date-fns/format";
import isWithinInterval from "date-fns/isWithinInterval";
import memoizeOne from "memoize-one";
import React, { FC, useEffect, useRef } from "react";
import { Animated, Text, View, VirtualizedList } from "react-native";
import { EventType } from "../../screens/HomeScreen";
import RNScrollView from "../RNScrollView";
import Events from "./Events";
import styles from "./styles";
import Times from "./Times";
import { CONTAINER_WIDTH, TIME_LABELS_IN_DISPLAY } from "./utils";

const GREY_COLOR = "#D4D7DA";
const MINUTES_IN_DAY = 60 * 24;

export type ItemType = {
  id: string;
  name: string;
};

interface RNWeekViewProps {
  headers: ItemType[];
  events: EventType[];
  hoursInDisplay?: number;
  numberOfColumns?: number;
}

const RNWeekView: FC<RNWeekViewProps> = ({
  events,
  headers,
  hoursInDisplay,
  numberOfColumns = 2,
}) => {
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
        end: new Date(`${formattedDate}T21:00`),
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
  }, [events]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingLeft: 64 }]}>
        <VirtualizedList
          ref={headerRef}
          style={[
            styles.header,
            {
              borderLeftWidth: 1,
              borderColor: GREY_COLOR,
            },
          ]}
          contentContainerStyle={{ height: 50 }}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={headers}
          getItem={(data, index) => data[index]}
          getItemCount={(data) => data.length}
          getItemLayout={(_, index) => getListItemLayout(index)}
          keyExtractor={(item: ItemType) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                key={item.id}
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  width: CONTAINER_WIDTH / (numberOfColumns as number),
                  borderRightWidth: 1,
                  borderColor: GREY_COLOR,
                }}
              >
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      </View>
      <RNScrollView bounces={false}>
        <View style={styles.scrollViewContent}>
          <Times times={times} textStyle={{ color: "#8C8C8C" }} />
          <VirtualizedList
            bounces={false}
            style={{ borderLeftWidth: 1, borderColor: GREY_COLOR }}
            data={headers}
            getItem={(data, index) => data[index]}
            getItemCount={(data) => data.length}
            getItemLayout={(_, index) => getListItemLayout(index)}
            keyExtractor={(item: ItemType) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <Events
                  item={item}
                  times={times}
                  events={events}
                  numberOfColumns={numberOfColumns}
                />
              );
            }}
            horizontal
            pagingEnabled
            scrollEventThrottle={1}
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
