import {useContext} from 'react';
import {authenticationContext, authenticationDispatchContext} from "../context/authenticationContext.ts";

export const useAuthentication = () => {
    return useContext(authenticationContext);
};

export const useAuthenticationDispatch = () => {
    return useContext(authenticationDispatchContext);
};
