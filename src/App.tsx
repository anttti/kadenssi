import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import Active from "./views/Active";
import Setup from "./views/Setup";
import { machine } from "./state-machine";

function App() {
  const [state, send] = useMachine(machine);

  const isSetup = state.matches("setup");
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");
  const isActive = isRunning || isPaused;

  console.log("Current state:", state.value);
  console.log("Context:", state.context);

  // Master clock. Always keep sending the TICK event, as it is only
  // reacted to when the state machine is in the "running" state.
  useEffect(() => {
    const interval = setInterval(() => send("TICK"), 1000);
    return () => clearInterval(interval);
  }, [send]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="ml-4 mb-4 uppercase font-bold tracking-widest text-center opacity-50">
        Kadenssi
      </h1>
      {isSetup && <Setup send={send} state={state} />}
      {isActive && <Active send={send} state={state} />}
    </div>
  );
}

export default App;
