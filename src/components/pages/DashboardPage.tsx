import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useAuthenticationDispatch} from "../../store/hook/useAuthentication.ts";
import UserProfile from "../dashboard/UserProfile.tsx";
import PostForm from "../forms/PostForm.tsx";

const DashboardPage = () => {
    const authenticationDispatch = useAuthenticationDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const authToken = localStorage.getItem('authToken');
        const refreashToken = localStorage.getItem("refreashToken")
        try {
            // Send a POST request to your backend logout endpoint
            const response = await axios.post(
                (import.meta.env.VITE_SERVER + import.meta.env.VITE_SERVER_LOGOUT_PATH), null, {
                    headers: {
                        authorization: `JWT ${authToken} ${refreashToken}`,
                    },
                });

            // Optionally, handle the response from the backend (e.g., display a success message)
            console.log(response.data);

            // Remove the token from localStorage on logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreashToken');

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
            className='mt-[25vh] p-[40px] translate-x--1/2 translate-y--1/2 bg-[rgba(0,0,0,.6)] box-border rounded-[10px]'>
            <UserProfile></UserProfile>
            <Button className='w-[200px]' variant="contained" onClick={handleLogout}>Logout</Button>
            <PostForm></PostForm>
        </div>
    );
}

export default DashboardPage;