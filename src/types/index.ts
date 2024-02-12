import { store } from "../store";

/** Type of app's state. */
export type RootState = ReturnType<typeof store.getState>;

/** Use this when you want to accept these possible values. */
export type MultiValue = boolean | number | string | Size | Offset;

/** For accepting the key-value pair of a specific type. */
export type KeyValue<T = any> = {
  key: keyof T;
  value: T[keyof T];
};

/** For accepting the key-value pair of a specific type. */
export type KeyValueTuple<T = any> = [keyof T, T[keyof T]];

/**
 * When you want to pass data into an item based on `indices`, use this.
 */
export type DataWithIndex<T = any> = {
  data: KeyValue<T>;
  /**
   * Position of the element.
   */
  index: number;
};

export interface Size {
  width: number;
  height: number;
}

export interface Offset {
  x: number;
  y: number;
}

/** Redux action states. */
export enum ActionState {
  PENDING = "/pending",
  FULFILLED = "/fulfilled",
  REJECTED = "/rejected",
}

/**
 * When any async operations happens,
 * this can be used to mention the state of the operation.
 */
export enum AsyncState {
  IDLE = "idle",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
