import React from "react";
import { State } from "xstate";
import classNames from "classnames";
import { IKadenssiContext, KadenssiEvent } from "../state-machine";
import Button from "../components/Button";
import { secondsToTime } from "../utils";

interface IActive {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
}

const Active: React.FC<IActive> = ({ send, state }) => {
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");
  const isFinished = state.matches("finished");

  const isDone = (stepIndex: number) =>
    stepIndex !== state.context.currentStep &&
    stepIndex < state.context.currentStep;

  const isCurrent = (stepIndex: number) =>
    stepIndex === state.context.currentStep;

  return (
    <>
      <h1 className="mb-6 text-6xl font-bold text-center">
        {secondsToTime(state.context.currentTime)}
      </h1>

      <ol className="mb-12 text-2xl rounded-lg p-4 bg-gray">
        {state.context.steps.map((step, index) => (
          <li
            key={step.id}
            className={classNames("grid grid-cols-2", {
              "line-through": isDone(index),
              "opacity-50": isDone(index) || !isCurrent(index)
            })}
          >
            <h2>{step.title}</h2>
            <time className="text-right">{secondsToTime(step.duration)}</time>
          </li>
        ))}
      </ol>

      <div className="flex justify-center">
        {isRunning && <Button onClick={() => send("PAUSE")}>Tauko</Button>}
        {isPaused && <Button onClick={() => send("RUN")}>Jatka</Button>}
        {isFinished && <Button onClick={() => send("RESET")}>Valmis</Button>}
      </div>
    </>
  );
};

export default Active;
