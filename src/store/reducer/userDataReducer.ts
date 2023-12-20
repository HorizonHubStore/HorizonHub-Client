import {user} from "../initialState/userDataInitialState.ts";

export const userDataReducer = (
    _authenticationPreviousData: user,
    action: { type?: string; payload: user }
): user => {
    switch (action.type) {
        // reference
        case 'set-userData': {
            return {
                userId:action.payload.userId,
                fullName: action.payload.fullName,
                imagePath : action.payload.imagePath
            };
        }
        
        default: {
            throw Error('Unknown action: ' + action?.type);
        }
    }
};
