import React, { useContext, useEffect } from "react";
import Active from "./views/Active";
import Setup from "./views/Setup";
import { AppContext } from "./AppContext";

const App = () => {
  const { send, state, onStepsChanged } = useContext(AppContext);

  const isSetup = state!.matches("setup");
  const isRunning = state!.matches("running");
  const isPaused = state!.matches("paused");
  const isFinished = state!.matches("finished");
  const isActive = isRunning || isPaused || isFinished;
  const steps = state!.context.steps;

  // Master clock. Always keep sending the TICK event, as it is only
  // reacted to when the state machine is in the "running" state.
  useEffect(() => {
    const interval = setInterval(() => send("TICK"), 1000);
    return () => clearInterval(interval);
  }, [send]);

  useEffect(() => {
    onStepsChanged!(steps);
  }, [steps, onStepsChanged]);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {isSetup && <Setup send={send} state={state!} />}
      {isActive && <Active send={send} state={state!} />}
    </div>
  );
};

export default App;
