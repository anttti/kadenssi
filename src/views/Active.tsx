import React from "react";
import { State } from "xstate";
import classNames from "classnames";
import { IKadenssiContext, KadenssiEvent } from "../state-machine";
import Button from "../components/Button";
import { secondsToTime, getTimeRemaining } from "../utils/time";

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

      <ol className="mb-12 text-2xl px-6 pt-5 pb-6 bg-white shadow rounded-lg border border-gray-500">
        {state.context.steps.map((step, index) => (
          <li
            key={step.id}
            className={classNames("grid grid-cols-2", {
              "line-through": isDone(index),
              "opacity-50": isDone(index) || !isCurrent(index)
            })}
          >
            <h2>{step.title}</h2>
            <div className="text-right">
              <time>
                {secondsToTime(
                  getTimeRemaining(
                    index,
                    state.context.steps,
                    state.context.currentTime,
                    state.context.currentStep
                  )
                )}
              </time>{" "}
              / <time>{secondsToTime(step.duration)}</time>
            </div>
          </li>
        ))}
      </ol>

      <div className="mb-12 flex justify-center">
        {isRunning && <Button onClick={() => send("PAUSE")}>Tauko</Button>}
        {isPaused && <Button onClick={() => send("RUN")}>Jatka</Button>}
        {isFinished && <Button onClick={() => send("RESET")}>Valmis</Button>}
      </div>

      <div className="flex justify-center">
        {isPaused && (
          <Button secondary onClick={() => send("STOP")}>
            Takaisin
          </Button>
        )}
      </div>
    </>
  );
};

export default Active;
