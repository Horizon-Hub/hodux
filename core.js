import { writable, get } from "svelte/store";
import types from "./types";
import { __UNDEFINED__, __FUNCTION__ } from "./constants";

export const createStore = (reducer, INITIAL_STATE, appliedMiddleWares) => {
  if (
    typeof INITIAL_STATE === __FUNCTION__ &&
    typeof appliedMiddleWares === __UNDEFINED__
  ) {
    appliedMiddleWares = INITIAL_STATE;
    INITIAL_STATE = undefined;
  }

  if (typeof appliedMiddleWares !== __UNDEFINED__) {
    if (typeof appliedMiddleWares !== __FUNCTION__) {
      throw new Error("Expected the Middlewares to be a function.");
    }

    return appliedMiddleWares(createStore)(reducer, INITIAL_STATE);
  }

  let store = writable(INITIAL_STATE);
  let { subscribe, update } = store;
  let listeners = [];

  const getState = () => get(store);

  const dispatch = (action) => {
    update((prevState) => {
      applyMiddleWare(action, getState, dispatch);
      return reducer(prevState, action);
    });
    listeners.forEach((listener) => listener());
  };

  dispatch({ type: types.INIT });

  return {
    subscribe,
    getState,
    dispatch,
  };
};

export const applyMiddleWare = (...middleWares) => (createStore) => (
  reducer,
  INIT_STATE
) => {
  const store = createStore(reducer, INIT_STATE);
  let dispatch;
  const middleWareStack = middleWares.map((middleware) =>
    middleware({
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    })
  );
  dispatch = compose(...middleWareStack)(store.dispatch);

  return {
    ...store,
    dispatch,
  };
};

export const compose = (...fns) => (args) =>
  fns.reduceRight((arg, fn) => fn(arg), args);

export const combineReducer = (reducers) => (state = {}, action) => {
  return Object.keys(reducers).reduce((nextState, currentReducer) => {
    nextState[currentReducer] = reducers[currentReducer](
      state[currentReducer],
      action
    );
    return nextState;
  }, {});
};
