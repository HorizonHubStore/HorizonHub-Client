export interface user {
    username: string;
    password: string;
    fullName: string;
}

export const userDataInitialState: user = {
    username: "",
    password: "",
    fullName: "",
};
