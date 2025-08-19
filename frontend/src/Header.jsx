import {Link} from 'react-router-dom';
import { TiHome } from "react-icons/ti";
import { BsBank } from "react-icons/bs";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import './Header.css';

const Header = () => {
    return (
        <header>
            <nav className='header-nav'>
                <Link className='link-tabs' to="/">
                    <img className='header-logo' src="https://res.cloudinary.com/drvirl5zq/image/upload/v1755426496/finsecure_header_logo_d4kzvi.png" alt="finsecure header logo" />
                </Link>
                <ul>
                    <li><Link className="link-tabs" to="/">
                        <p className='nav-items'>Home</p>
                        <TiHome className='header-icons' />
                    </Link></li>
                    <li><Link className="link-tabs" to="/banking">
                        <p className='nav-items'>Banking</p>
                        <BsBank className='header-icons' />
                    </Link></li>
                    <li><Link className="link-tabs" to="/loans">
                        <p className='nav-items'>Loans</p>
                        <RiMoneyRupeeCircleFill className='header-icons' />
                    </Link></li>
                    <li><Link className="link-tabs" to="/profile">
                        <img className='profile-icon' src="https://cdn-icons-png.flaticon.com/512/8847/8847419.png" alt="profile icon" />
                    </Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
