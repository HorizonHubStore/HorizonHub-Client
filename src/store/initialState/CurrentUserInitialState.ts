export interface ICurrentUser {
    imagePath: string;
    userId: string;
    fullName: string;
}

export const CurrentUserInitialState: ICurrentUser = {
    imagePath: "",
    userId: "",
    fullName: "",
};
