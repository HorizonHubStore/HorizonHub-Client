import {createContext, Dispatch} from "react";
import {CurrentUserInitialState, ICurrentUser} from "../initialState/CurrentUserInitialState.ts";

export const userDataContext = createContext(CurrentUserInitialState as ICurrentUser);

export const userDataDispatchContext = createContext(
    null as unknown as Dispatch<{ type: string; payload: ICurrentUser }>
);