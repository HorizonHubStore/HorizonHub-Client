import {NavLink} from 'react-router-dom';

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

const Sidebar = () =>
    <div
        className='fixed right-0 top-0 z-50 flex h-screen w-[150px] flex-col items-center gap-16 bg-gray-800 p-2 px-6 pb-4'>
        <div className='h-28 w-28 rounded-full bg-orange-600'></div>
        <ul className='flex flex-col items-center gap-8'>
            <NavLinkOption name='מסך בית' link='dashboard'/>
            <NavLinkOption name='התחברות' link='login'/>
            <NavLinkOption name='הרשמה' link='signup'/>
        </ul>
    </div>

export default Sidebar;