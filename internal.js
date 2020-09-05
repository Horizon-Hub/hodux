import { writable, get } from "svelte/store";
const store = () => {
  const inner = writable(0);
  const { update, subscribe } = inner;

  return {
    subscribe: subscribe,
    increment: () => {
      update((n) => n + 1);
      return get(inner);
    },
  };
};

export const hoduxInternal = store();
