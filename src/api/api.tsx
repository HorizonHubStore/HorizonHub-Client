import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    AxiosRequestConfig,
} from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER + "/",
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest: RetryableRequestConfig = error.config || {};
        console.log("start");
        // If the error is due to an expired access token
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                // Refresh the access token using your refresh token

                const authToken = localStorage.getItem('authToken');
                const refreshToken = localStorage.getItem("refreshToken")
                console.log(authToken);
                console.log(refreshToken);
                const response = await api.post(
                    import.meta.env.VITE_SERVER_GET_REFRESH_TOKEN,
                    null,
                    {
                        headers: {
                            authorization: `JWT ${authToken} ${refreshToken}`,
                        },
                    }
                );
                localStorage.setItem('authToken',response.data.accessToken)
                localStorage.setItem('authToken',response.data.refreshToken)
                console.log(response.data.accessToken);
                console.log(response.data.refreshToken);
                

                // Update the original request headers with the new access token
                if (originalRequest.headers != null) {
                    originalRequest.headers.authorization = `JWT ${response.data.accessToken} ${response.data.refreshToken}`;

                    // Retry the original request with the new access token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                // Handle errors, such as the refresh token being invalid
                // Redirect to login or handle the situation accordingly
                // You might want to clear the user session and redirect to the login page
            }
        }
        console.log("after");
        // If the error is not due to an expired access token, handle it normally
        return Promise.reject(error);
    }
);

export default api;
