import { getTimeRemaining } from "../utils";

it("calculates remaining time per step", () => {
  const steps = [
    { id: 0, title: "", duration: 10 },
    { id: 0, title: "", duration: 10 },
    { id: 0, title: "", duration: 10 },
    { id: 0, title: "", duration: 10 }
  ];
  expect(getTimeRemaining(0, steps, 0, 0)).toBe(10);
  expect(getTimeRemaining(1, steps, 0, 0)).toBe(10);
  expect(getTimeRemaining(0, steps, 5, 0)).toBe(5);
  expect(getTimeRemaining(1, steps, 5, 1)).toBe(10);
  expect(getTimeRemaining(1, steps, 15, 1)).toBe(5);
  expect(getTimeRemaining(3, steps, 35, 3)).toBe(5);
  expect(getTimeRemaining(0, steps, 100, 0)).toBe(10);
  expect(getTimeRemaining(3, steps, 100, 3)).toBe(10);
});
