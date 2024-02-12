import { EqualityFn, useSelector } from "react-redux";

import { RootState } from "../types";

interface CallbackInterface<Type> {
  (state: RootState): Type;
}

/**
 * A hook to access the redux store's state.
 * This hook is an abstraction on top of the normal `useSelector` hook. But with our app's state type `RootState`. Make sure to pass the proper type argument so that you will get the goodies of typescript.
 *
 * @returns The selected state.
 */
export const useAppSelector = <Type,>(
  /**
   * The selector function.
   */
  callback: CallbackInterface<Type>,
  /**
   * The function that will be used to determine equality.
   */
  equalityFn?: EqualityFn<Type> | undefined,
) => {
  return useSelector<RootState, Type>(callback, equalityFn);
};
