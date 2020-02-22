import React from "react";
import { State } from "xstate";
import { IKadenssiContext, KadenssiEvent } from "../state-machine";
import Button from "../components/Button";
import { prependZero } from "../utils";

interface IActive {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
}

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
      <h1 className="text-6xl font-bold text-center">
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
