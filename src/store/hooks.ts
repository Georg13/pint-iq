import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// хуки вместо стандартных useDispatch и useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()