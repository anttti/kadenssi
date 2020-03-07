import React, { useRef } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { State } from "xstate";
import Button from "../components/Button";
import SetupStep from "../components/SetupStep";
import { guards, IKadenssiContext, KadenssiEvent } from "../state-machine";
import { reorder } from "../utils/order";

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const steps = reorder(
      state.context.steps,
      result.source.index,
      result.destination.index
    );

    send("SORT_STEPS", { steps });
  };

  return (
    <div className="pb-6 bg-white shadow rounded-lg border border-gray-500">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="steps">
          {provided => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="rounded-lg p-4 mb-4 bg-gray"
            >
              {state.context.steps.map((step, index) => (
                <SetupStep
                  key={step.id}
                  step={step}
                  index={index}
                  onDelete={(id: number) => send("REMOVE_STEP", { id })}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <form
        className="grid gap-4 grid-cols-4 col-span-4 px-4"
        onSubmit={createStep}
      >
        <div className="col-span-3">
          <label
            htmlFor="title"
            className="block uppercase tracking-widest text-gray-600 text-xs font-bold mb-2"
          >
            Nimi
          </label>
          <input
            id="title"
            type="text"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-100 ease-in-out"
            value={state.context.newStepTitle}
            placeholder="Lisää uusi..."
            onChange={e => onTitleChanged(e.target.value)}
            ref={titleRef}
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="title"
            className="block uppercase tracking-widest text-gray-600 text-xs font-bold mb-2"
          >
            Kesto
          </label>
          <input
            id="duration"
            type="number"
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all duration-100 ease-in-out"
            value={state.context.newStepDuration}
            placeholder="Kesto (min)"
            onChange={e => onDurationChanged(e.target.value)}
          />
        </div>

        <input type="submit" style={{ visibility: "hidden" }} />
      </form>

      <Button
        className="block mx-auto"
        onClick={() => send("RUN")}
        disabled={!canStart}
      >
        Aloita
      </Button>
    </div>
  );
};

export default Setup;
