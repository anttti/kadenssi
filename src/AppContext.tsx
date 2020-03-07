import React from "react";
import { useMachine } from "@xstate/react";
import { State } from "xstate";
import {
  machine,
  IKadenssiContext,
  IStep,
  KadenssiEvent
} from "./state-machine";
import { readStateFromUrl, writeStateToUrl } from "./utils/url-state";

type ContextProps = {
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  send: any;
  onStepsChanged: (steps: IStep[]) => void;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

/**
 * Hook XState to React context to enable hot module reloading
 * while developing the application (otherwise the state of the
 * state machine would get blown away whenever the React app
 * is live reloaded).
 */
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
