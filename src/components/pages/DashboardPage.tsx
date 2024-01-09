import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuthenticationDispatch} from "../../store/hook/useAuthentication.ts";
import UserProfile from "../dashboard/UserProfile.tsx";
import PostForm from "../forms/PostForm.tsx";
import api from "../../api/api.tsx";

const DashboardPage = () => {
    const authenticationDispatch = useAuthenticationDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem("refreshToken")
        try {
            // Send a POST request to your backend logout endpoint
            const response = await api.post(
                (import.meta.env.VITE_SERVER_LOGOUT_PATH), null, {
                    headers: {
                        authorization: `JWT ${authToken} ${refreshToken}`,

                    },
                });

            // Optionally, handle the response from the backend (e.g., display a success message)
            console.log(response.data);

            // Remove the token from localStorage on logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');

            // Update the authentication status
            authenticationDispatch({type: 'set-isAuthenticated', payload: false});

            // Redirect to the login page after logout
            navigate('/login');
        } catch (error) {
            if (error instanceof Error) {
                navigate('error');
                throw Error(`Login failed: ${error.message}`);
            }
        }
    };


    return (
        <div
            className='flex flex-col gap-5 p-6 translate-x--1/2 translate-y--1/2 bg-[rgba(0,0,0,.6)] box-border rounded-[10px]'>
            <UserProfile/>
            <PostForm/>
            <div className="flex justify-center">
                <Button className='w-[200px]' variant="contained" onClick={handleLogout}>
                    התנתק מהמערכת
                </Button>
            </div>

        </div>
    );
}

export default DashboardPage;