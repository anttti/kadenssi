import React from "react";
import { useMachine } from "@xstate/react";
import { State } from "xstate";
import { machine, IKadenssiContext, KadenssiEvent } from "./state-machine";

type ContextProps = {
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  send: any;
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
  const params = new URL(document.location.href).searchParams;
  const encodedCtx = params.get("c");
  if (encodedCtx) {
    try {
      return JSON.parse(window.atob(encodedCtx));
    } catch (e) {
      return defaultContext;
    }
  }
  return defaultContext;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

export const AppProvider = (props: any) => {
  const machineWithContext = machine.withContext(readStateFromUrl());
  const [state, send] = useMachine(machineWithContext);
  return (
    <AppContext.Provider value={{ state, send }}>
      {props.children}
    </AppContext.Provider>
  );
};
