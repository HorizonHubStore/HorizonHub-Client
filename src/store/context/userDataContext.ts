import {createContext, Dispatch} from "react";
import { user, userDataInitialState } from "../initialState/userDataInitialState.ts";

export const userDataContext = createContext(userDataInitialState as user);

export const userDataDispatchContext = createContext(
    null as unknown as Dispatch<{ type: string; payload: {username:'',password:'',fullName:''} }>
);