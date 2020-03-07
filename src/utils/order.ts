import { IStep } from "../state-machine";

/**
 * Move an item in an array from one index to another.
 * @param steps An array of all of the steps
 * @param fromIndex Which item is being moved
 * @param toIndex Where the item is being moved to
 */
export function reorder(steps: IStep[], fromIndex: number, toIndex: number) {
  const reorderedSteps = Array.from(steps);
  const [movedStep] = reorderedSteps.splice(fromIndex, 1);
  reorderedSteps.splice(toIndex, 0, movedStep);

  return reorderedSteps;
}
