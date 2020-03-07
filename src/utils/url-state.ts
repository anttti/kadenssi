import { IStep } from "../state-machine";
import defaultContext from "./default-context";

/**
 * Reads base64-encoded steps array from URL if it is
 * present and attempts to decode it. If the URL has no
 * state present or it is invalid, return the default
 * context.
 */
export function readStateFromUrl() {
  const encodedCtx = window.location.hash.substr(1);
  if (encodedCtx) {
    try {
      const steps = JSON.parse(window.atob(encodedCtx));
      return { ...defaultContext, steps };
    } catch (e) {
      return defaultContext;
    }
  }
  return defaultContext;
}

/**
 * Encode and write an array's worth of steps to the URL
 * as base64.
 * @param steps Current steps configured to the context
 */
export function writeStateToUrl(steps: IStep[]) {
  const payload = window.btoa(JSON.stringify(steps));
  window.location.hash = payload;
}
