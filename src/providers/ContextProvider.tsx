import {ReactElement, useReducer} from "react";
import {authenticationContext, authenticationDispatchContext} from "../store/context/authenticationContext.ts";
import {userDataContext, userDataDispatchContext} from '../store/context/userDataContext.ts'
import {authenticationReducer} from "../store/reducer/authenticationReducer.ts";
import {authenticationInitialState} from "../store/initialState/authenticationInitialState.ts";
import {userDataReducer} from "../store/reducer/userDataReducer.ts";
import {CurrentUserInitialState} from "../store/initialState/CurrentUserInitialState.ts";
import {GoogleOAuthProvider} from '@react-oauth/google'


const ContextProvider = ({children}: { children: ReactElement }) => {
    const [authentication, authenticationDispatch] = useReducer(authenticationReducer, authenticationInitialState);
    const [userData, userDataDipatch] = useReducer(userDataReducer, CurrentUserInitialState)

    return (
        <GoogleOAuthProvider clientId="996842994144-lqu1gcagi4joo1l4m3lffdituof7sver.apps.googleusercontent.com">
            <userDataContext.Provider value={userData}>
                <userDataDispatchContext.Provider value={userDataDipatch}>
                    <authenticationContext.Provider value={authentication}>
                        <authenticationDispatchContext.Provider value={authenticationDispatch}>
                            {children}
                        </authenticationDispatchContext.Provider>
                    </authenticationContext.Provider>
                </userDataDispatchContext.Provider>
            </userDataContext.Provider>
        </GoogleOAuthProvider>
    );
};
export default ContextProvider;