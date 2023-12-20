export interface user {
    userId: string;
    fullName: string;
    imagePath: string;
}

export const userDataInitialState: user = {
    userId : "",
    fullName: "",
    imagePath: "",
};
