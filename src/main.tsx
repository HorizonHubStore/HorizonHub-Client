import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Root from "./routes/Root.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import {SignupRoute} from "./routes/SignupRoute.tsx";
import {LoginRoute} from "./routes/LoginRoute.tsx";
import {DashboardRoute} from "./routes/DashboardRoute.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'dashboard',
                element: <DashboardRoute/>,
            },
            {
                path: 'login',
                element: <LoginRoute/>,
            },
            {
                path: 'signup',
                element: <SignupRoute/>,
            },
            {
                path: '/',
                element: <Navigate to='dashboard'/>,
            },
            {
                path: '*',
                element: <Navigate to='dashboard'/>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
