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
      <h1 className="mb-6 text-6xl font-bold font-mono text-center">
        {secondsToTime(state.context.currentTime)}
      </h1>

      <ol className="mb-12 md:text-xl lg:text-2xl px-6 pt-5 pb-6 bg-white dreamy-shadow rounded-lg">
        {state.context.steps.map((step, index) => (
          <li
            key={step.id}
            className={classNames("flex", {
              "line-through": isDone(index),
              "opacity-50": isDone(index) || !isCurrent(index)
            })}
          >
            <h2 className="flex-1 pr-2">{step.title}</h2>
            <div className="font-mono text-right">
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

      <div className="mb-8 flex justify-center">
        {isRunning && <Button onClick={() => send("PAUSE")}>Tauko</Button>}
        {isPaused && <Button onClick={() => send("RUN")}>Jatka</Button>}
        {isFinished && <Button onClick={() => send("RESET")}>Takaisin</Button>}
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
