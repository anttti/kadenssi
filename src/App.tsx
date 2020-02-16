import React, { useState, useEffect, useRef } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import classNames from "classnames";

interface IKadenssiSchema {
  states: {
    setup: {};
    running: {};
    paused: {};
    finished: {};
  };
}

type KadenssiEvent =
  | { type: "SETUP" }
  | { type: "ADD_STEP"; title: string; duration: number }
  | { type: "REMOVE_STEP"; id: number }
  | { type: "EDIT_STEP"; id: number; title: string; duration: number }
  | { type: "MOVE_STEP_UP"; id: number }
  | { type: "MOVE_STEP_DOWN"; id: number }
  | { type: "RUN" }
  | { type: "TICK" }
  | { type: "PAUSE" }
  | { type: "STOP" }
  | { type: "FINISH" }
  | { type: "RESET" };

interface IStep {
  id: number;
  title: string;
  duration: number;
}

interface IKadenssiContext {
  steps: IStep[];
  currentStep: number;
  currentTime: number;
}

const guards = {
  canStart: (context: IKadenssiContext) => context.steps.length > 0,
  isTimeLeft: (context: IKadenssiContext) =>
    context.currentTime <
    context.steps.map(s => s.duration).reduce((acc, curr) => curr + acc, 0),
  areStepsLeft: (context: IKadenssiContext) =>
    context.currentStep < context.steps.length - 1
};

const machine = Machine<IKadenssiContext, IKadenssiSchema, KadenssiEvent>(
  {
    id: "kadenssi",
    initial: "setup",
    context: {
      steps: [],
      currentTime: 0,
      currentStep: 0
    },
    states: {
      setup: {
        entry: assign({
          currentStep: _ => 0,
          currentTime: _ => 0
        }),
        on: {
          RUN: {
            target: "running",
            cond: "canStart"
          },
          ADD_STEP: {
            target: "setup",
            actions: assign({
              steps: (context, { title, duration }) => {
                const id = new Date().getTime();
                return context.steps.concat({ id, title, duration });
              }
            })
          },
          REMOVE_STEP: {
            target: "setup",
            actions: assign({
              steps: (context, { id }) => context.steps.filter(s => s.id !== id)
            })
          },
          EDIT_STEP: {
            target: "setup",
            actions: assign({
              steps: (context, { id, title, duration }) => {
                // @TODO: Support editing steps
                return context.steps;
              }
            })
          },
          // @TODO: Support reordering
          MOVE_STEP_UP: "setup",
          MOVE_STEP_DOWN: "setup"
        }
      },
      running: {
        entry: assign({
          currentTime: ({ currentTime }) => currentTime + 1,
          currentStep: ({ steps, currentTime, currentStep }) => {
            const isTimeLeftInCurrentStep =
              currentTime < steps[currentStep].duration;
            const isNextStepAvailable = currentStep < steps.length - 1;
            if (!isTimeLeftInCurrentStep && isNextStepAvailable) {
              return currentStep + 1;
            }
            return currentStep;
          }
        }),
        on: {
          PAUSE: "paused",
          STOP: "setup",
          TICK: [
            { target: "running", cond: "isTimeLeft" },
            { target: "running", cond: "areStepsLeft" },
            { target: "finished" }
          ]
        }
      },
      paused: {
        on: { RUN: "running", STOP: "setup" }
      },
      finished: {
        on: { RESET: "setup" }
      }
    }
  },
  {
    actions: {},
    guards
  }
);

function App() {
  const [state, send] = useMachine(machine);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const isSetup = state.matches("setup");
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");
  const isActive = isRunning || isPaused;
  const isFinished = state.matches("finished");
  const canStart = guards.canStart(state.context);

  const createStep = (e: any) => {
    e.preventDefault();
    send("ADD_STEP", { title, duration: parseInt(duration, 10) });
    setTitle("");
    setDuration("");
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };

  // Master clock. Always keep sending the TICK event, as it is only
  // reacted to when the state machine is in the "running" state.
  useEffect(() => {
    const interval = setInterval(() => send("TICK"), 1000);
    return () => clearInterval(interval);
  }, [send]);

  console.log("Current state:", state.value);

  return (
    <>
      <div className="p-4">
        <h1 className="font-bold">Kadenssi</h1>
        <p>
          T: {state.context.currentTime} (s: {state.context.currentStep})
        </p>
      </div>

      <div className="p-4">
        <ul>
          {state.context.steps.map(step => (
            <li key={step.id} className="grid gap-4 grid-cols-4 col-span-4">
              <div className="col-span-3">{step.title}</div>
              <div className="col-span-1">{step.duration}</div>
            </li>
          ))}
        </ul>
        {isSetup && (
          <form
            className="grid gap-4 grid-cols-4 col-span-4"
            onSubmit={createStep}
          >
            <input
              id="title"
              type="text"
              className="border p-1 col-span-3"
              value={title}
              placeholder="Title"
              onChange={e => setTitle(e.target.value)}
              ref={titleRef}
            />

            <input
              id="duration"
              type="number"
              className="border p-1 col-span-1"
              value={duration}
              placeholder="Duration (min)"
              onChange={e => setDuration(e.target.value)}
            />

            <input type="submit" style={{ visibility: "hidden" }} />
          </form>
        )}

        {isSetup && (
          <button
            className={classNames("bg-blue-600 text-white rounded p-2", {
              "opacity-50": !canStart
            })}
            onClick={() => send("RUN")}
            disabled={!canStart}
          >
            Start
          </button>
        )}

        {isActive && (
          <p>
            Current step: {state.context.steps[state.context.currentStep].title}
          </p>
        )}

        {isRunning && <button onClick={() => send("PAUSE")}>Pause</button>}

        {isPaused && <button onClick={() => send("RUN")}>Continue</button>}

        {isFinished && (
          <>
            <h1>All done!</h1>
            <button onClick={() => send("RESET")}>Back to setup</button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
