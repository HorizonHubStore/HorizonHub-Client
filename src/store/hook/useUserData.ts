import {useContext} from 'react';
import {userDataContext, userDataDispatchContext} from "../context/userDataContext.ts";

export const useUserData = () => {
    return useContext(userDataContext);
};

export const useUserDataDispatch = () => {
    return useContext(userDataDispatchContext);
};
