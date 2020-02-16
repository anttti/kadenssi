import React, { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import Button from "./components/Button";
import { machine, guards } from "./state-machine";

const prependZero = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return val.toString();
};

function App() {
  const [state, send] = useMachine(machine);
  const titleRef = useRef<HTMLInputElement>(null);

  const isSetup = state.matches("setup");
  const isRunning = state.matches("running");
  const isPaused = state.matches("paused");
  const isFinished = state.matches("finished");
  const isActive = isRunning || isPaused || isFinished;
  const canStart = guards.canStart(state.context);

  console.log("Current state:", state.value);
  console.log("Context:", state.context);

  // Master clock. Always keep sending the TICK event, as it is only
  // reacted to when the state machine is in the "running" state.
  useEffect(() => {
    const interval = setInterval(() => send("TICK"), 1000);
    return () => clearInterval(interval);
  }, [send]);

  const createStep = (e: any) => {
    e.preventDefault();
    send("ADD_STEP");
    if (titleRef.current) {
      titleRef.current.focus();
    }
  };

  const onTitleChanged = (str: string) => {
    send("SET_TITLE", { title: str });
  };

  const onDurationChanged = (str: string) => {
    send("SET_DURATION", { duration: parseInt(str, 10) });
  };

  const renderSetup = () => {
    return (
      <>
        <ul>
          {state.context.steps.map(step => (
            <li key={step.id} className="grid gap-4 grid-cols-4 col-span-4">
              <div className="col-span-3">{step.title}</div>
              <div className="col-span-1">{step.duration}</div>
            </li>
          ))}
        </ul>

        <form
          className="grid gap-4 grid-cols-4 col-span-4"
          onSubmit={createStep}
        >
          <input
            id="title"
            type="text"
            className="border p-1 col-span-3"
            value={state.context.newStepTitle}
            placeholder="Title"
            onChange={e => onTitleChanged(e.target.value)}
            ref={titleRef}
          />

          <input
            id="duration"
            type="number"
            className="border p-1 col-span-1"
            value={state.context.newStepDuration}
            placeholder="Duration (min)"
            onChange={e => onDurationChanged(e.target.value)}
          />

          <input type="submit" style={{ visibility: "hidden" }} />
        </form>

        <Button onClick={() => send("RUN")} disabled={!canStart}>
          Start
        </Button>
      </>
    );
  };

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

        {isRunning && <Button onClick={() => send("PAUSE")}>Pause</Button>}
        {isPaused && <Button onClick={() => send("RUN")}>Continue</Button>}
        {isFinished && (
          <>
            <h1>All done!</h1>
            <Button onClick={() => send("RESET")}>Back to setup</Button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {isSetup && renderSetup()}
      {isActive && renderActive()}
    </div>
  );
}

export default App;
