import {user} from "../initialState/userDataInitialState.ts";

export const userDataReducer = (
    _authenticationPreviousData: user,
    action: { type?: string; payload: user }
): user => {
    switch (action.type) {
        // reference
        case 'set-userData': {
            return {
                username: action.payload.username,
                password: action.payload.password,
                fullName: action.payload.fullName,
            };
        }
        default: {
            throw Error('Unknown action: ' + action?.type);
        }
    }
};
