import { IStep } from "../state-machine";

/**
 * Convert an integer to string, ensuring it has at least two numbers
 * (if it is < 10, prepend with a zero)
 * @param val A number
 */
export const prependZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
};

/**
 * Format seconds as min:secs
 * @param seconds Seconds as an integer
 */
export function secondsToTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return prependZero(minutes) + ":" + prependZero(secs);
}

/**
 * Calculate time remaining for a given step.
 * @param stepIndex Step index of which time remaining is to be calculated
 * @param steps An array of all of the steps
 * @param currentTime How much time has elapsed so far
 * @param currentStep What is the current step index
 */
export function getTimeRemaining(
  stepIndex: number,
  steps: IStep[],
  currentTime: number,
  // @TODO: Refactor currentStep out, should be determined from currentTime instead
  currentStep: number
) {
  const timeUntilThisStepStart = steps
    .slice(0, stepIndex)
    .reduce((acc, curr) => {
      return acc + curr.duration;
    }, 0);

  const combinedDurationOfAllSteps = steps.reduce(
    (acc, curr) => acc + curr.duration,
    0
  );

  if (currentStep > stepIndex) {
    return steps[stepIndex].duration;
  }

  if (currentTime > combinedDurationOfAllSteps) {
    return steps[stepIndex].duration;
  }

  // If we are running the step that was asked for, return it's remaining time
  const elapsedFromThisStep = currentTime - timeUntilThisStepStart;
  if (elapsedFromThisStep > 0) {
    return elapsedFromThisStep;
  }

  // Otherwise just return it's full duration
  return steps[stepIndex].duration;
}
