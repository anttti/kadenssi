import { Machine, assign } from "xstate";

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
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_DURATION"; duration: number }
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
  newStepTitle: string;
  newStepDuration: number;
}

const guards = {
  canStart: (context: IKadenssiContext) => context.steps.length > 0,
  isValidNewStep: (context: IKadenssiContext) =>
    context.newStepTitle.trim().length > 0 && context.newStepDuration > 0,
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
      steps: [
        {
          id: 0,
          title: "Intro ja follow-up",
          duration: 10
        },
        {
          id: 1,
          title: "Aiheen esittely",
          duration: 10
        }
      ],
      currentTime: 0,
      currentStep: 0,
      newStepTitle: "",
      newStepDuration: 0
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
          SET_TITLE: {
            target: "setup",
            actions: assign({
              newStepTitle: (_, { title }) => title
            })
          },
          SET_DURATION: {
            target: "setup",
            actions: assign({
              newStepDuration: (_, { duration }) => duration
            })
          },
          ADD_STEP: {
            target: "setup",
            cond: "isValidNewStep",
            actions: assign({
              steps: context =>
                context.steps.concat({
                  id: new Date().getTime(),
                  title: context.newStepTitle,
                  duration: context.newStepDuration * 60 // transform into seconds
                }),
              newStepTitle: _ => "",
              newStepDuration: _ => 0
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
        // Even though there are no more steps left, the time keeps on going...
        entry: assign({
          currentTime: ({ currentTime }) => currentTime + 1
        }),
        on: { RESET: "setup", TICK: "finished" }
      }
    }
  },
  {
    actions: {},
    guards
  }
);

export { machine, guards };