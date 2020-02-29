import React, { useRef, useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from "react-beautiful-dnd";
import { State } from "xstate";
import update from "immutability-helper";
import Button from "../components/Button";
import SetupStep from "../components/SetupStep";
import { guards, IKadenssiContext, KadenssiEvent } from "../state-machine";

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

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
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
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="steps">
          {provided => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="rounded-lg p-4 mb-4 grid row-gap-4 bg-gray"
            >
              {state.context.steps.map((step, index) => (
                <SetupStep
                  key={step.id}
                  step={step}
                  index={index}
                  onDelete={(id: number) => send("REMOVE_STEP", { id })}
                />
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

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
