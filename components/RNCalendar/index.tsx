import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { CalendarList } from "react-native-calendars";
import XDate from "xdate";
import {
  generateWeekdays,
  parseDate,
  VelocityTracker,
  xdateToData,
} from "./helpers";
import defaultStyles from "./styles";

// TODO: Add type safety

const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

export default class RNCalendarStrip extends Component {
  static displayName = "RNCalendarStrip";

  static propTypes = {
    onDayPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.style = defaultStyles;

    const windowSize = Dimensions.get("window");
    this.viewHeight = windowSize.height;
    this.viewWidth = windowSize.width;

    this.scrollTimeout = undefined;
    this.headerState = "idle";

    this.state = {
      scrollY: new Animated.Value(0),
      calendarIsReady: false,
      calendarScrollable: false,
      selectedDay: parseDate(props.selected) || XDate(true),
      topDay: parseDate(props.selected) || XDate(true),
    };

    this.currentMonth = this.state.selectedDay.clone();

    this.knobTracker = new VelocityTracker();
    this.state.scrollY.addListener(({ value }) => this.knobTracker.add(value));
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.state.scrollY.removeAllListeners();
  }

  calendarOffset() {
    return 96 - this.viewHeight / 2;
  }

  initialScrollPadPosition = () => {
    return Math.max(0, this.viewHeight - HEADER_HEIGHT);
  };

  setScrollPadPosition = (y, animated) => {
    if (this.scrollPad.scrollTo) {
      this.scrollPad.scrollTo({ x: 0, y, animated });
    } else {
      // Support for RN O.61 (Expo 37)
      this.scrollPad.getNode().scrollTo({ x: 0, y, animated });
    }
  };

  enableCalendarScrolling() {
    this.setState({
      calendarScrollable: true,
    });

    _.invoke(this.props, "onCalendarToggled", true);

    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    this.calendar.scrollToDay(
      this.state.selectedDay,
      this.calendarOffset() + 1,
      true
    );
  }

  chooseDayFromCalendar = (d) => {
    this.chooseDay(d, !this.state.calendarScrollable);
  };

  chooseDay(d, optimisticScroll) {
    const day = parseDate(d);

    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone(),
    });

    if (!optimisticScroll) {
      this.setState({
        topDay: day.clone(),
      });
    }

    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar.scrollToDay(day, this.calendarOffset(), true);

    _.invoke(this.props, "onDayPress", xdateToData(day));
  }

  generateMarkings = () => {
    const { markedDates, items } = this.props;
    let markings = markedDates;

    if (!markings) {
      markings = {};
      Object.keys(items || {}).forEach((key) => {
        if (items[key] && items[key].length) {
          markings[key] = { marked: true };
        }
      });
    }

    const key = this.state.selectedDay.toString("yyyy-MM-dd");
    return {
      ...markings,
      [key]: { ...(markings[key] || {}), ...{ selected: true } },
    };
  };

  onScrollPadLayout = () => {
    // When user touches knob, the actual component that receives touch events is a ScrollView.
    // It needs to be scrolled to the bottom, so that when user moves finger downwards,
    // scroll position actually changes (it would stay at 0, when scrolled to the top).
    this.setScrollPadPosition(this.initialScrollPadPosition(), false);
    // delay rendering calendar in full height because otherwise it still flickers sometimes
    setTimeout(() => this.setState({ calendarIsReady: true }), 0);
  };

  onCalendarListLayout = () => {
    this.calendar.scrollToDay(
      this.state.selectedDay.clone(),
      this.calendarOffset(),
      false
    );
  };

  onLayout = (event) => {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
  };

  onTouchStart = () => {
    this.headerState = "touched";
    if (this.knob) {
      this.knob.setNativeProps({ style: { opacity: 0.5 } });
    }
  };

  onTouchEnd = () => {
    if (this.knob) {
      this.knob.setNativeProps({ style: { opacity: 1 } });
    }

    if (this.headerState === "touched") {
      this.setScrollPadPosition(0, true);
      this.enableCalendarScrolling();
    }

    this.headerState = "idle";
  };

  onStartDrag = () => {
    this.headerState = "dragged";
    this.knobTracker.reset();
  };

  onSnapAfterDrag = (e) => {
    // on Android onTouchEnd is not called if dragging was started
    this.onTouchEnd();
    const currentY = e.nativeEvent.contentOffset.y;
    this.knobTracker.add(currentY);
    const projectedY = currentY + this.knobTracker.estimateSpeed() * 250; /*ms*/
    const maxY = this.initialScrollPadPosition();
    const snapY = projectedY > maxY / 2 ? maxY : 0;
    this.setScrollPadPosition(snapY, true);

    if (snapY === 0) {
      this.enableCalendarScrolling();
    }
  };

  renderCalendarList() {
    const shouldHideExtraDays = this.state.calendarScrollable
      ? this.props.hideExtraDays
      : false;

    return (
      <CalendarList
        ref={(c) => (this.calendar = c)}
        current={this.currentMonth}
        markedDates={this.generateMarkings()}
        calendarWidth={this.viewWidth}
        scrollEnabled={this.state.calendarScrollable}
        hideExtraDays={shouldHideExtraDays}
        onLayout={this.onCalendarListLayout}
        onDayPress={this.chooseDayFromCalendar}
        onVisibleMonthsChange={this.onVisibleMonthsChange}
      />
    );
  }

  renderKnob() {
    const { hideKnob, renderKnob } = this.props;
    let knob = <View style={this.style.knobContainer} />;

    if (!hideKnob) {
      const knobView = renderKnob ? (
        renderKnob()
      ) : (
        <View style={this.style.knob} />
      );
      knob = this.state.calendarScrollable ? null : (
        <View style={this.style.knobContainer}>
          <View ref={(c) => (this.knob = c)}>{knobView}</View>
        </View>
      );
    }
    return knob;
  }

  render() {
    const agendaHeight = this.initialScrollPadPosition();
    const weekDaysNames = generateWeekdays();
    const weekdaysStyle = [
      this.style.weekdays,
      {
        opacity: this.state.scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: "clamp",
        }),
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
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
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [agendaHeight, 0],
      extrapolate: "clamp",
    });
    const contentTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: "clamp",
    });
    const headerStyle = [
      this.style.header,
      {
        bottom: agendaHeight,
        transform: [{ translateY: headerTranslate }],
      },
    ];

    if (!this.state.calendarIsReady) {
      headerStyle.push({ height: 0 });
      weekdaysStyle.push({ height: HEADER_HEIGHT });
    }

    const shouldAllowDragging = !this.state.calendarScrollable;
    const scrollPadPosition =
      (shouldAllowDragging ? HEADER_HEIGHT : 0) - KNOB_HEIGHT;
    const scrollPadStyle = {
      position: "absolute",
      width: 80,
      height: KNOB_HEIGHT,
      top: scrollPadPosition,
      left: (this.viewWidth - 80) / 2,
    };

    return (
      <View onLayout={this.onLayout} style={{ flex: 1, overflow: "hidden" }}>
        <View style={this.style.children}>{this.props.children}</View>
        <Animated.View style={headerStyle}>
          <Animated.View
            style={{ flex: 1, transform: [{ translateY: contentTranslate }] }}
          >
            {this.renderCalendarList()}
          </Animated.View>
          {this.renderKnob()}
        </Animated.View>
        <Animated.View style={weekdaysStyle}>
          {weekDaysNames.map((day, index) => (
            <Text
              allowFontScaling={false}
              key={day + index}
              style={this.style.weekday}
              numberOfLines={1}
            >
              {day}
            </Text>
          ))}
        </Animated.View>
        <Animated.ScrollView
          ref={(ref) => (this.scrollPad = ref)}
          style={scrollPadStyle}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          scrollsToTop={false}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
          onScrollBeginDrag={this.onStartDrag}
          onScrollEndDrag={this.onSnapAfterDrag}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{ height: agendaHeight + KNOB_HEIGHT }}
            onLayout={this.onScrollPadLayout}
          />
        </Animated.ScrollView>
      </View>
    );
  }
}
