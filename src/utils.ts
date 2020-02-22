export const prependZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
};

export function secondsToTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return prependZero(minutes) + ":" + prependZero(secs);
}
