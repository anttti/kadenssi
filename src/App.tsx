import React, { useState, useEffect } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

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
    guards: {
      canStart: context => context.steps.length > 0,
      isTimeLeft: context =>
        context.currentTime <
        context.steps.map(s => s.duration).reduce((acc, curr) => curr + acc, 0),
      areStepsLeft: context => context.currentStep < context.steps.length - 1
    }
  }
);

function App() {
  const [state, send] = useMachine(machine);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");

  const createStep = (e: any) => {
    e.preventDefault();
    send("ADD_STEP", { title, duration: parseInt(duration, 10) });
  };

  // Master clock. Always keep sending the TICK event, as it is only
  // reacted to when the state machine is in the "running" state.
  useEffect(() => {
    const interval = setInterval(() => send("TICK"), 1000);
    return () => clearInterval(interval);
  }, [send]);

  return (
    <div className="p-4">
      <h1 className="font-bold">Kadenssi</h1>
      <p>Current state: {state.value}</p>
      <p>Current step: {state.context.currentStep}</p>
      <p>Current time: {state.context.currentTime}</p>
      <ul>
        {state.context.steps.map(step => (
          <li key={step.id}>
            {step.title}: {step.duration}
          </li>
        ))}
      </ul>

      {state.matches("setup") && (
        <button
          className="bg-blue-600 text-white rounded p-2"
          onClick={() => send("RUN")}
        >
          Start
        </button>
      )}

      {state.matches("setup") && (
        <form onSubmit={createStep}>
          <label className="block">
            Title:
            <input
              type="text"
              className="border p-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </label>

          <label className="block">
            Duration:
            <input
              type="text"
              className="border p-2"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </label>

          <input type="submit" onClick={createStep} value="Create" />
        </form>
      )}

      {state.matches("running") && (
        <button onClick={() => send("PAUSE")}>Pause</button>
      )}

      {state.matches("paused") && (
        <button onClick={() => send("RUN")}>Continue</button>
      )}

      {state.matches("finished") && (
        <>
          <h1>All done!</h1>
          <button onClick={() => send("RESET")}>Back to setup</button>
        </>
      )}
    </div>
  );
}

export default App;
