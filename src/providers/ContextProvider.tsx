import {ReactElement, useReducer} from "react";
import {authenticationContext, authenticationDispatchContext} from "../store/context/authenticationContext.ts";
import {userDataContext,userDataDispatchContext} from '../store/context/userDataContext.ts'
import {authenticationReducer} from "../store/reducer/authenticationReducer.ts";
import {authenticationInitialState} from "../store/initialState/authenticationInitialState.ts";
import { userDataReducer } from "../store/reducer/userDataReducer.ts";
import { userDataInitialState } from "../store/initialState/userDataInitialState.ts";


const ContextProvider = ({ children }:{children: ReactElement}) => {
     const [authentication, authenticationDispatch] = useReducer(authenticationReducer, authenticationInitialState);
     const [userData, userDataDipatch] = useReducer(userDataReducer,userDataInitialState)

    return (
        <userDataContext.Provider value={userData}>
        <userDataDispatchContext.Provider value={userDataDipatch}>
            <authenticationContext.Provider value={authentication}>
            <authenticationDispatchContext.Provider value={authenticationDispatch}>
                {children}
            </authenticationDispatchContext.Provider>
            </authenticationContext.Provider>
        </userDataDispatchContext.Provider>
        </userDataContext.Provider>
    );
};
export default ContextProvider;