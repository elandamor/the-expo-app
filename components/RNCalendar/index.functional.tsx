import { addDays, format, startOfWeek } from "date-fns";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { useVelocityTracker } from "../../hooks";
import defaultStyles from "./styles";

interface RNCalendarStripProps {
  onDayPress?: (dateString: string) => void;
}

const useForceUpdate = () => {
  const [count, setCount] = useState(0);

  return () => setCount(() => count + 1);
};

const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

const generateWeekdays = (
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined = 0
) => {
  const firstDOW = startOfWeek(new Date(), { weekStartsOn: firstDayOfWeek });
  const shortWeekDaysArray = Array.from(Array(7)).map((e, i) =>
    format(addDays(firstDOW, i), "EEE")
  );

  return shortWeekDaysArray;
};

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const RNCalendarStrip: FC<RNCalendarStripProps> = ({
  children,
  onDayPress,
}) => {
  const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

  const forceUpdate = useForceUpdate();
  const knobTracker = useVelocityTracker();

  const viewHeight = useRef(windowHeight);
  const viewWidth = useRef(windowWidth);

  const calendarRef = useRef<CalendarList>(null);
  const knobRef = useRef<any>(null);
  const scrollPadRef = useRef<any>(null);

  const [calendarIsReady, setCalendarIsReady] = useState(false);
  const [calendarScrollable, setCalendarScrollable] = useState(false);
  const [headerState, setHeaderState] = useState<
    "idle" | "dragged" | "touched"
  >("idle");
  const [selectedDay, setSelectedDay] = useState(formatDate(new Date()));

  const scrollY = new Animated.Value(0);
  const scrollPadPosition = HEADER_HEIGHT - KNOB_HEIGHT;

  scrollY.addListener(({ value }) => {
    knobTracker.add(value);
  });

  useEffect(() => {
    return () => scrollY.removeAllListeners();
  }, []);

  const calendarOffset = () => {
    return 96 - viewHeight.current / 2;
  };

  const initialScrollPadPosition = () => {
    return Math.max(0, viewHeight.current - HEADER_HEIGHT);
  };

  const agendaHeight = initialScrollPadPosition();

  console.log({
    //     agendaHeight,
    headerState,
    knobTracker,
    //     scrollPadPosition,
  });

  const setScrollPadPosition = (y: number, animated: boolean) => {
    if (scrollPadRef?.current?.scrollTo) {
      scrollPadRef.current.scrollTo({ x: 0, y, animated });
    }
  };

  const enableCalendarScrolling = () => {
    setCalendarScrollable(true);

    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    const day = new Date(selectedDay);
    calendarRef.current.scrollToDay(day, calendarOffset() + 1, true);
  };

  const chooseDayFromCalendar = (d: any) => {
    chooseDay(d);
  };

  const chooseDay = (d) => {
    const day = new Date(d.dateString);

    setCalendarScrollable(false);
    setSelectedDay(formatDate(day));

    setScrollPadPosition(initialScrollPadPosition(), true);
    calendarRef?.current?.scrollToDay(day, calendarOffset(), true);

    onDayPress && onDayPress(formatDate(day));
  };

  const onScrollPadLayout = () => {
    // When user touches knob, the actual component that receives touch events is a ScrollView.
    // It needs to be scrolled to the bottom, so that when user moves finger downwards,
    // scroll position actually changes (it would stay at 0, when scrolled to the top).
    setScrollPadPosition(initialScrollPadPosition(), false);
    // delay rendering calendar in full height because otherwise it still flickers sometimes
    setTimeout(() => setCalendarIsReady(true), 0);
  };

  const onCalendarListLayout = () => {
    const day = new Date(selectedDay);
    calendarRef?.current?.scrollToDay(day, calendarOffset(), false);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    viewHeight.current = event.nativeEvent.layout.height;
    viewWidth.current = event.nativeEvent.layout.width;
    forceUpdate();
  };

  const onTouchStart = () => {
    setHeaderState("touched");

    if (knobRef.current) {
      knobRef.current.setNativeProps({ style: { opacity: 0.5 } });
    }
  };

  const onTouchEnd = () => {
    if (knobRef.current) {
      knobRef.current.setNativeProps({ style: { opacity: 1 } });
    }

    if (headerState === "touched") {
      setScrollPadPosition(0, true);
      enableCalendarScrolling();
    }

    setHeaderState("idle");
  };

  const onStartDrag = () => {
    setHeaderState("dragged");
    knobTracker.reset();
  };

  const onSnapAfterDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // on Android onTouchEnd is not called if dragging was started
    // onTouchEnd();
    // const currentY = event.nativeEvent.contentOffset.y;
    // console.log({ currentY });
    // knobTracker.add(currentY);
    // const projectedY = currentY + knobTracker.estimateSpeed() * 250; /*ms*/
    // console.log({ projectedY }, knobTracker.estimateSpeed());
    // const maxY = initialScrollPadPosition();
    // console.log({ maxY });
    // const snapY = projectedY > maxY / 2 ? maxY : 0;
    // console.log({ snapY });
    // setScrollPadPosition(snapY, true);
    // if (snapY === 0) {
    //   enableCalendarScrolling();
    // }
  };

  const renderCalendarList = () => {
    return (
      <CalendarList
        ref={calendarRef}
        current={selectedDay}
        calendarWidth={viewWidth.current}
        scrollEnabled={calendarScrollable}
        onLayout={onCalendarListLayout}
        onDayPress={chooseDayFromCalendar}
      />
    );
  };

  const renderKnob = () => {
    if (calendarScrollable) {
      return null;
    }

    return (
      <View style={defaultStyles.knobContainer}>
        <View ref={knobRef}>
          <View style={defaultStyles.knob} />
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [agendaHeight, 0],
      extrapolate: "clamp",
    });

    const contentTranslate = scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: "clamp",
    });

    const headerStyle = [
      defaultStyles.header,
      {
        bottom: agendaHeight,
        transform: [{ translateY: headerTranslate }],
      },
    ];

    if (!calendarIsReady) {
      headerStyle.push({ height: 0 });
    }

    return (
      <Animated.View style={headerStyle}>
        <Animated.View
          style={{ flex: 1, transform: [{ translateY: contentTranslate }] }}
        >
          {renderCalendarList()}
        </Animated.View>
        {renderKnob()}
      </Animated.View>
    );
  };

  const renderWeekDays = () => {
    const weekDaysNames = generateWeekdays();
    const weekdaysStyle = [
      defaultStyles.weekdays,
      {
        opacity: scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: "clamp",
        }),
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [
                Math.max(0, agendaHeight - HEADER_HEIGHT),
                agendaHeight,
              ],
              outputRange: [-HEADER_HEIGHT, 0],
              extrapolate: "clamp",
            }),
          },
        ],
      },
    ];

    if (!calendarIsReady) {
      weekdaysStyle.push({ height: HEADER_HEIGHT });
    }

    return (
      <Animated.View style={weekdaysStyle}>
        {weekDaysNames.map((day, index) => (
          <Text
            allowFontScaling={false}
            key={day + index}
            style={defaultStyles.weekday}
            numberOfLines={1}
          >
            {day}
          </Text>
        ))}
      </Animated.View>
    );
  };

  const renderChildren = () => (
    <View style={defaultStyles.children}>{children}</View>
  );

  const renderScrollView = () => {
    return (
      <Animated.ScrollView
        ref={scrollPadRef}
        style={{
          height: KNOB_HEIGHT,
          left: (viewWidth.current - 80) / 2,
          position: "absolute",
          top: scrollPadPosition,
          width: 80,
        }}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={8}
        scrollsToTop={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onScrollBeginDrag={onStartDrag}
        onScrollEndDrag={onSnapAfterDrag}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View
          style={{
            height: agendaHeight + KNOB_HEIGHT,
          }}
          onLayout={onScrollPadLayout}
        />
      </Animated.ScrollView>
    );
  };

  return (
    <View onLayout={onLayout} style={defaultStyles.container}>
      {renderChildren()}
      {renderHeader()}
      {renderWeekDays()}
      {renderScrollView()}
    </View>
  );
};

export default RNCalendarStrip;
