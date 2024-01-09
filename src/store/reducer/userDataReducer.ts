import {ICurrentUser} from "../initialState/CurrentUserInitialState.ts";

export const userDataReducer = (
    _authenticationPreviousData: ICurrentUser,
    action: { type?: string; payload: ICurrentUser }
): ICurrentUser => {
    switch (action.type) {
        // reference
        case 'set-userData': {
            return action.payload;
        }

        default: {
            throw Error('Unknown action: ' + action?.type);
        }
    }
};
