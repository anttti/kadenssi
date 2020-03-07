import React from "react";
import { State } from "xstate";
import classNames from "classnames";
import { IKadenssiContext, KadenssiEvent } from "../state-machine";
import Button from "../components/Button";
import withFadeIn from "../components/withFadeIn";
import { secondsToTime, getTimeRemaining } from "../utils/time";

interface IActive {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  style?: object;
}

const FadeInButton = withFadeIn(Button);

const Active: React.FC<IActive> = ({ send, state, style = {} }) => {
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");
  const isFinished = state.matches("finished");

  const isDone = (stepIndex: number) =>
    stepIndex !== state.context.currentStep &&
    stepIndex < state.context.currentStep;

  const isCurrent = (stepIndex: number) =>
    stepIndex === state.context.currentStep;

  return (
    <div className="container p-4 min-h-screen" style={style}>
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

      <div className="mb-20 flex justify-center">
        <FadeInButton isVisible={isRunning} onClick={() => send("PAUSE")}>
          Tauko
        </FadeInButton>
        <FadeInButton isVisible={isPaused} onClick={() => send("RUN")}>
          Jatka
        </FadeInButton>
        <FadeInButton isVisible={isFinished} onClick={() => send("RESET")}>
          Takaisin
        </FadeInButton>
      </div>

      <div className="flex justify-center">
        <FadeInButton
          isVisible={isPaused}
          secondary
          onClick={() => send("STOP")}
        >
          Takaisin
        </FadeInButton>
      </div>
    </div>
  );
};

export default Active;
