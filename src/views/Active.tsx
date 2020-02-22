import React from "react";
import Button from "../components/Button";
import { IKadenssiContext, KadenssiEvent } from "../state-machine";
import { State } from "xstate";

interface IActive {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
}

const prependZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
};

const Active: React.FC<IActive> = ({ send, state }) => {
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");

  const currentStep = state.context.steps[state.context.currentStep];
  const currentStepMinutes = Math.floor(currentStep.duration / 60);
  const currentStepSeconds = currentStep.duration % 60;
  const elapsed = state.context.currentTime;
  const elapsedMinutes = Math.floor(elapsed / 60);
  const elapsedSeconds = elapsed % 60;

  return (
    <>
      <h1 className="">
        {prependZero(elapsedMinutes)}:{prependZero(elapsedSeconds)}
      </h1>
      <p>
        {currentStep.title} ({prependZero(currentStepMinutes)}:
          {prependZero(currentStepSeconds)})
        </p>

      {isRunning && <Button onClick={() => send("PAUSE")}>Tauko</Button>}
      {isPaused && <Button onClick={() => send("RUN")}>Jatka</Button>}
    </>
  );
};

export default Active;