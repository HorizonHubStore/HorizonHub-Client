export interface IAuthentication {
    isAuthenticated: boolean,
}

export const authenticationInitialState: IAuthentication = {
    isAuthenticated: false
}
