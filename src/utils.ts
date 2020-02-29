import { IStep } from "./state-machine";

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

export function getTimeRemaining(
  stepIndex: number,
  steps: IStep[],
  currentTime: number,
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
