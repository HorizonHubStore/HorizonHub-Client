import {NavLink} from 'react-router-dom';
import HorizonHubSvg from './assets/HorizonHub.svg';
import { useAuthentication, useAuthenticationDispatch } from './store/hook/useAuthentication';
import { useEffect } from 'react';
import { useUserData } from './store/hook/useUserData';

interface INavLinkOption {
    name: string,
    link: string
}
  



const NavLinkOption = (props: INavLinkOption) =>
    <li className='px-4 py-3'>
        <NavLink
            to={props.link}
            className={({isActive}) =>
                isActive
                    ? 'rounded-xl bg-gray-600 px-4 py-3 text-xl leading-none'
                    : 'rounded-xl px-4 py-3 text-xl leading-none hover:bg-gray-600'
            }>{props.name}</NavLink>
    </li>

const Sidebar = () => {
    
    const authenticationDispatch = useAuthenticationDispatch();
    
    useEffect(() => {
        // Check if authentication token exists in local storage
        const authToken = localStorage.getItem('authToken');
        if(authToken){
            authenticationDispatch({type: 'set-isAuthenticated', payload: true});
        }
        
    }, []); // Run this effect only once during component mount
    
    const { isAuthenticated } = useAuthentication();
    return (
        <div
        className='fixed right-0 top-0 z-50 flex h-screen w-[150px] flex-col items-center gap-8 bg-gray-800 px-6 pb-4'>
        <img src={HorizonHubSvg} className="h-36 w-36" alt="HorizonHub Logo"/>
        <ul className='flex flex-col items-center gap-8'>
            {isAuthenticated && <NavLinkOption name='מסך בית' link='dashboard'/>}
            {!isAuthenticated && <NavLinkOption name='התחברות' link='login'/>}
            {!isAuthenticated && <NavLinkOption name='הרשמה' link='signup'/>}
        </ul>
    </div>
    );
};
    

export default Sidebar;
