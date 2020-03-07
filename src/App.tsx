import React, { useContext, useEffect } from "react";
import Active from "./views/Active";
import Setup from "./views/Setup";
import { AppContext } from "./AppContext";
import withScaleFadeIn from "./components/withScaleFadeIn";
import withSlideDown from "./components/withSlideDown";

const FadeInActive = withScaleFadeIn(Active);
const SlideDownSetup = withSlideDown(Setup);

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
    <>
      <SlideDownSetup isVisible={isSetup} send={send} state={state!} />
      <FadeInActive isVisible={isActive} send={send} state={state!} />
    </>
  );
};

export default App;
