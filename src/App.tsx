import React from "react";
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
  | { type: "FINISH" };

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
          RUN: "running",
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
        on: {
          PAUSE: "paused",
          STOP: "setup",
          TICK: {
            target: "running",
            actions: assign({
              // TODO: If time is up, go to next step
              //       If no steps left, go to finished
              currentTime: context => context.currentTime + 1
            })
          },
          FINISH: "finished"
        }
      },
      paused: {
        on: { RUN: "running", STOP: "setup" }
      },
      finished: {
        on: {}
      }
    }
  },
  {
    actions: {
      reset: (context, event) => {}
    }
  }
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
