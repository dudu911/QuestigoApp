import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Typed hooks for Redux Toolkit
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
