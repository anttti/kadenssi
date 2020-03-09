import React, { useRef } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { State } from "xstate";
import Button from "../components/Button";
import Input from "../components/Input";
import SetupStep from "../components/SetupStep";
import { guards, IKadenssiContext, KadenssiEvent } from "../state-machine";
import { reorder } from "../utils/order";

interface ISetup {
  send: any;
  state: State<IKadenssiContext, KadenssiEvent, any, any>;
  style?: object;
}

const Setup: React.FC<ISetup> = ({ send, state, style = {} }) => {
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
    <div className="container p-4 z-10" style={style}>
      <div className="pb-6 bg-white dreamy-shadow rounded-lg">
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
            <Input
              id="title"
              title="Nimi"
              placeholder="Lisaa uusi..."
              value={state.context.newStepTitle}
              onChange={onTitleChanged}
              inputRef={titleRef}
            />
          </div>

          <div className="col-span-1">
            <Input
              id="title"
              title="Kesto"
              placeholder="Kesto (min)"
              value={state.context.newStepDuration}
              onChange={onDurationChanged}
              type="number"
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
    </div>
  );
};

export default Setup;
