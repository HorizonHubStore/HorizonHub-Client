export interface ICurrentUser {
    userName: string;
    password: string;
    fullName: string;
}

export const CurrentUserInitialState: ICurrentUser = {
    userName: "",
    password: "",
    fullName: "",
};
