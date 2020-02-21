import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import Button from "./components/Button";
import Setup from "./views/Setup";
import { machine } from "./state-machine";

const prependZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
};

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

  const renderActive = () => {
    const currentStep = state.context.steps[state.context.currentStep];
    const currentStepMinutes = Math.floor(currentStep.duration / 60);
    const currentStepSeconds = currentStep.duration % 60;
    const elapsed = state.context.currentTime;
    const elapsedMinutes = Math.floor(elapsed / 60);
    const elapsedSeconds = elapsed % 60;

    return (
      <>
        <h1 className="">
          {prependZero(elapsedMinutes)}:{prependZero(elapsedSeconds)}
        </h1>
        <p>
          {currentStep.title} ({prependZero(currentStepMinutes)}:
          {prependZero(currentStepSeconds)})
        </p>

        {isRunning && <Button onClick={() => send("PAUSE")}>Tauko</Button>}
        {isPaused && <Button onClick={() => send("RUN")}>Jatka</Button>}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="ml-4 mb-4 uppercase font-bold tracking-widest text-center opacity-50">
        Kadenssi
      </h1>
      {isSetup && <Setup send={send} state={state} />}
      {isActive && renderActive()}
    </div>
  );
}

export default App;
