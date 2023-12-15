import ContextProvider from "../store/ContextProvider.tsx";
import {Outlet} from "react-router-dom";

export default function Root() {
    return (
        <ContextProvider>
            <Outlet />
        </ContextProvider>
    );
}