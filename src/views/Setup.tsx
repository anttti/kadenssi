import React, { useRef } from "react";
import Button from "../components/Button";
import { guards, IKadenssiContext, KadenssiEvent } from "../state-machine";
import { State } from "xstate";

interface ISetup {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
}

const Setup: React.FC<ISetup> = ({ send, state }) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const canStart = guards.canStart(state.context);

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

  return (
    <>
      <ul className="rounded-lg p-4 mb-4 grid row-gap-2 bg-gray">
        {state.context.steps.map(step => (
          <li key={step.id} className="grid gap-4 grid-cols-4 col-span-4">
            <div className="col-span-3">{step.title}</div>
            <div className="col-span-1 text-right">{step.duration} min</div>
          </li>
        ))}
      </ul>

      <form className="grid gap-4 grid-cols-4 col-span-4" onSubmit={createStep}>
        <input
          id="title"
          type="text"
          className="rounded-lg py-2 px-4 col-span-3 focus:outline-none bg-gray focus:bg-light-gray transition-all duration-100 ease-in-out"
          value={state.context.newStepTitle}
          placeholder="Otsikko"
          onChange={e => onTitleChanged(e.target.value)}
          ref={titleRef}
        />

        <input
          id="duration"
          type="number"
          className="rounded-lg py-2 px-4 col-span-1 focus:outline-none bg-gray focus:bg-light-gray transition-all duration-100 ease-in-out"
          value={state.context.newStepDuration}
          placeholder="Kesto (min)"
          onChange={e => onDurationChanged(e.target.value)}
        />

        <input type="submit" style={{ visibility: "hidden" }} />
      </form>

      <Button
        className="block mx-auto"
        onClick={() => send("RUN")}
        disabled={!canStart}
      >
        Aloita
      </Button>
    </>
  );
};

export default Setup;
