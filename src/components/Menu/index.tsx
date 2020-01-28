import React from 'react';
import { Link } from '@reach/router';
import { logout } from 'firebase-utils/auth';
import './style.scss';

const Menu: React.FC = () => {
    return (
        <div className="user-avatar">
            <ul>
                <li>
                    <Link to="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="profile">
                        Profile
                    </Link>
                </li>
                <li>
                    <button onClick={logout}>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Menu;
