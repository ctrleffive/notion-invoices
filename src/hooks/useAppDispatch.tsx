import { useDispatch } from "react-redux";

import { store } from "../store";

/**
 * Provides better typescript support than the usual `useDispatch`.
 * Always use this.
 */
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
