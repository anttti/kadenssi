import React from "react";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import Button from "./Button";
import { secondsToTime } from "../utils/time";
import { IStep } from "../state-machine";

interface ISetupStep {
  step: IStep;
  onDelete: (id: number) => void;
  index: number;
}

const SetupStep: React.FC<ISetupStep> = ({ step, index, onDelete }) => {
  return (
    <Draggable index={index} key={step.id} draggableId={step.id.toString()}>
      {(provided, snapshot) => (
        <li
          className={classNames(
            "flex items-center mb-2 py-2 pl-4 pr-2 rounded-md transition-shadow transition-colors duration-500 border border-transparent bg-gray-200",
            {
              "shadow-lg": snapshot.isDragging
            }
          )}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <div className="flex-1">{step.title}</div>
          <div className="w-24 flex justify-between items-center">
            <span style={{ lineHeight: "20px" }}>
              {secondsToTime(step.duration)}
            </span>
            <Button small onClick={() => onDelete(step.id)}>
              <IoIosRemoveCircleOutline size="24px" />
            </Button>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default SetupStep;
