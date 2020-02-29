import React from "react";
import { useMachine } from "@xstate/react";
import { State } from "xstate";
import {
  machine,
  IKadenssiContext,
  IStep,
  KadenssiEvent
} from "./state-machine";

type ContextProps = {
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  send: any;
  onStepsChanged: (steps: IStep[]) => void;
};

const defaultContext = {
  steps: [
    {
      id: 0,
      title: "Intro & follow-up",
      duration: 10 * 60
    },
    {
      id: 1,
      title: "Aihe",
      duration: 40 * 60
    },
    {
      id: 2,
      title: "Jakson valinnat",
      duration: 15 * 60
    }
  ],
  currentTime: 0,
  currentStep: 0,
  newStepTitle: "",
  newStepDuration: 0
};

const readStateFromUrl = () => {
  const encodedCtx = window.location.hash.substr(1);
  if (encodedCtx) {
    try {
      const steps = JSON.parse(window.atob(encodedCtx));
      return { ...defaultContext, steps };
    } catch (e) {
      return defaultContext;
    }
  }
  return defaultContext;
};

const writeStateToUrl = (steps: IStep[]) => {
  const payload = window.btoa(JSON.stringify(steps));
  window.location.hash = payload;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

export const AppProvider = (props: any) => {
  const machineWithContext = machine.withContext(readStateFromUrl());
  const [state, send] = useMachine(machineWithContext);
  return (
    <AppContext.Provider
      value={{ state, send, onStepsChanged: writeStateToUrl }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
