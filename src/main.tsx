import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./pages/Root.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import {SignupRoute} from "./pages/SignupRoute.tsx";
import {LoginRoute} from "./pages/LoginRoute.tsx";
import {DashboardRoute} from "./pages/DashboardRoute.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <LoginRoute/>,
            },
            {
                path: 'signup',
                element: <SignupRoute/>,
            },
            {
                path: 'dashboard',
                element: <DashboardRoute/>,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
