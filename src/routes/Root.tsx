import ContextProvider from "../providers/ContextProvider.tsx";
import {Outlet} from "react-router-dom";
import Sidebar from "../Sidebar.tsx";
import MuiProvider from "../providers/MuiProvider.tsx";

export default function Root() {
    return (
        <ContextProvider>
            <MuiProvider>
                <div className='flex min-h-screen w-full flex-grow'>
                    <Sidebar/>
                    <div className='flex h-screen w-full flex-grow flex-col items-center gap-8 pl-4 pr-[170px]'>
                        <Outlet/>
                    </div>
                </div>
            </MuiProvider>
        </ContextProvider>
    );
}