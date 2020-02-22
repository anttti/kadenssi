import React, { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from "react-dnd";
import { TiDelete } from "react-icons/ti";
import Button from "./Button";
import { secondsToTime } from "../utils";
import { IStep } from "../state-machine";

interface ISetupStep {
  step: IStep;
  index: number;
  onDelete: (id: number) => void;
  reorderStep: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const SetupStep: React.FC<ISetupStep> = ({
  step,
  index,
  onDelete,
  reorderStep
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const [, drop] = useDrop({
    accept: "SETUP_STEP",
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Dragging on the item that is being dragged itself
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      reorderStep(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ opacity }, drag] = useDrag({
    item: { type: "SETUP_STEP", id: step.id, index },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  });

  drag(drop(ref));

  return (
    <li className="flex items-center" ref={ref} style={{ opacity }}>
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
  );
};

export default SetupStep;
