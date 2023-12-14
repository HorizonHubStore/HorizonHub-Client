import {IAuthentication} from "../initialState/authenticationInitialState.ts";

export const authenticationReducer = (
    _authenticationPreviousData: IAuthentication,
    action: { type?: string; payload: boolean }
): IAuthentication => {
    switch (action.type) {
        // reference
        case 'set-isAuthenticated': {
            return {
                isAuthenticated: action.payload,
            };
        }
        default: {
            throw Error('Unknown action: ' + action?.type);
        }
    }
};
