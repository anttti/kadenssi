import React from "react";
import { useMachine } from "@xstate/react";
import { State } from "xstate";
import { machine, IKadenssiContext, KadenssiEvent } from "./state-machine";

type ContextProps = {
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  send: any;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

export const AppProvider = (props: any) => {
  const [state, send] = useMachine(machine);
  return (
    <AppContext.Provider value={{ state, send }}>
      {props.children}
    </AppContext.Provider>
  );
};
