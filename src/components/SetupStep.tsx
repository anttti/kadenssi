import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TiDelete } from "react-icons/ti";
import Button from "./Button";
import { secondsToTime } from "../utils";
import { IStep } from "../state-machine";

interface ISetupStep {
  step: IStep;
  onDelete: (id: number) => void;
  index: number;
}

const SetupStep: React.FC<ISetupStep> = ({ step, index, onDelete }) => {
  return (
    <Draggable index={index} key={step.id} draggableId={step.id.toString()}>
      {provided => (
        <li
          className="flex items-center py-2 bg-gray rounded-md"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="mr-4 cursor-move opacity-75"
          >
            <path fill="#fff" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"></path>
          </svg>
          <div className="flex-1">{step.title}</div>
          <div className="w-24 flex justify-between items-center">
            {secondsToTime(step.duration)}
            <Button type="small" onClick={() => onDelete(step.id)}>
              <TiDelete size="1.4rem" />
            </Button>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default SetupStep;
