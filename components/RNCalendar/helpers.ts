import { addDays, format, startOfWeek } from "date-fns";
import XDate from "xdate";

// TODO: Add type safety

export class VelocityTracker {
  constructor() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }

  add(position) {
    const timestamp = new Date().valueOf();
    if (this.lastPosition && timestamp > this.lastTimestamp) {
      const diff = position - this.lastPosition;
      if (diff > 0.001 || diff < -0.001) {
        this.history.push(diff / (timestamp - this.lastTimestamp));
      }
    }
    this.lastPosition = position;
    this.lastTimestamp = timestamp;
  }

  estimateSpeed() {
    const finalTrend = this.history.slice(-3);
    const sum = finalTrend.reduce((r, v) => r + v, 0);
    return sum / finalTrend.length;
  }

  reset() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }
}

export const generateWeekdays = (
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined = 0
) => {
  const firstDOW = startOfWeek(new Date(), { weekStartsOn: firstDayOfWeek });
  const shortWeekDaysArray = Array.from(Array(7)).map((e, i) =>
    format(addDays(firstDOW, i), "EEE")
  );

  return shortWeekDaysArray;
};

export function padNumber(n) {
  if (n < 10) {
    return "0" + n;
  }
  return n;
}

export function xdateToData(xdate) {
  const dateString = xdate.toString("yyyy-MM-dd");
  return {
    year: xdate.getFullYear(),
    month: xdate.getMonth() + 1,
    day: xdate.getDate(),
    timestamp: XDate(dateString, true).getTime(),
    dateString: dateString,
  };
}

export function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) {
    // conventional data timestamp
    return XDate(d.timestamp, true);
  } else if (d instanceof XDate) {
    // xdate
    return XDate(d.toString("yyyy-MM-dd"), true);
  } else if (d.getTime) {
    // javascript date
    const dateString =
      d.getFullYear() +
      "-" +
      padNumber(d.getMonth() + 1) +
      "-" +
      padNumber(d.getDate());
    return XDate(dateString, true);
  } else if (d.year) {
    const dateString =
      d.year + "-" + padNumber(d.month) + "-" + padNumber(d.day);
    return XDate(dateString, true);
  } else if (d) {
    // timestamp number or date formatted as string
    return XDate(d, true);
  }
}
