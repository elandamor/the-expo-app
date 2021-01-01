import { useState } from "react";

export default function useVelocityTracker() {
  const [history, setHistory] = useState<number[]>([]);
  const [lastPosition, setLastPosition] = useState<number>();
  const [lastTimestamp, setLastTimestamp] = useState<number>();

  const add = (position: number) => {
    if (!lastPosition || !lastTimestamp) {
      return;
    }

    const timestamp = new Date().valueOf();

    if (timestamp > lastTimestamp) {
      const diff = position - lastPosition;

      if (diff > 0.001 || diff < -0.001) {
        history.push(diff / (timestamp - lastTimestamp));
      }
    }

    setLastPosition(position);
    setLastTimestamp(timestamp);
  };

  const estimateSpeed = () => {
    const finalTrend = history.slice(-3);
    const sum = finalTrend.reduce((r, v) => r + v, 0);
    return sum / finalTrend.length;
  };

  const reset = () => {
    setHistory([]);
    setLastPosition(undefined);
    setLastTimestamp(undefined);
  };

  return {
    add,
    estimateSpeed,
    reset,
    history,
    lastPosition,
    lastTimestamp,
  };
}
