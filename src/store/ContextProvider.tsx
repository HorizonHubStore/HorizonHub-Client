import {ReactElement, useReducer} from "react";
import {authenticationContext, authenticationDispatchContext} from "./context/authenticationContext.ts";
import {authenticationReducer} from "./reducer/authenticationReducer.ts";
import {authenticationInitialState} from "./initialState/authenticationInitialState.ts";

const ContextProvider = ({ children }:{children: ReactElement}) => {
     const [authentication, authenticationDispatch] = useReducer(authenticationReducer, authenticationInitialState);

    return (
        <authenticationContext.Provider value={authentication}>
        <authenticationDispatchContext.Provider value={authenticationDispatch}>
            {children}
        </authenticationDispatchContext.Provider>
        </authenticationContext.Provider>
    );
 };
export default ContextProvider;