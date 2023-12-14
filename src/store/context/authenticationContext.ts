import {createContext, Dispatch} from "react";
import {authenticationInitialState, IAuthentication} from "../initialState/authenticationInitialState.ts";

export const authenticationContext = createContext(authenticationInitialState as IAuthentication);

export const authenticationDispatchContext = createContext(
    null as unknown as Dispatch<{ type: string; payload: boolean }>
);