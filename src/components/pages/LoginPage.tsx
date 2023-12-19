import {ChangeEvent, useState} from "react";
import {useAuthenticationDispatch} from "../../store/hook/useAuthentication.ts";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {Button, TextField} from "@mui/material";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const authenticationDispatch = useAuthenticationDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log(username, password);
        try {
            // Send a POST request to your backend login endpoint
            const response = await axios.post(
                (import.meta.env.VITE_SERVER + import.meta.env.VITE_SERVER_LOGIN_PATH),
                {username, password},
                {headers: {'Content-Type': 'application/json'}}
            );

            // Retrieve the token from the response
            const token = response.data.token;

            // Store the token in localStorage
            localStorage.setItem('authToken', token);

            // Update the authentication status
            authenticationDispatch({type: 'set-isAuthenticated', payload: true});

            navigate('dashboard');
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
            <h2 className='mt-0 mx-0 mb-[30px] p-0 text-white text-center text-4xl'>Log In</h2>
            <form className='flex justify-center items-center flex-col gap-6'>
                <TextField className='w-[400px]' label="Username" variant="outlined"
                           onChange={(event: ChangeEvent<HTMLInputElement>) => {
                               setUsername(event.target.value);
                           }}/>
                <TextField className='w-[400px]' label="Password" type="password" autoComplete="current-password"
                           onChange={(event: ChangeEvent<HTMLInputElement>) => {
                               setPassword(event.target.value);
                           }}/>
                <Button className='w-[200px]' variant="contained" onClick={handleLogin}>Submit</Button>
            </form>
        </div>
    );
};

export default LoginPage;
