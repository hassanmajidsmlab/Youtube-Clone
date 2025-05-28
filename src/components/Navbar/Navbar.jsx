import React from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import more_icon from '../../assets/more.png';
import notification_icon from '../../assets/notification.png';
import profile_icon from '../../assets/profile.png';
import { Link } from 'react-router-dom';

const Navbar = ({setSidebar}) => {
  return (
    <nav className="navbar flex-div">
      {/* Left Side */}
      <div className="nav-left flex-div">
        <img src={menu_icon} alt="menu" onClick={()=>setSidebar(prev=>prev===false?true:false)} className="menu-icon" />
         <Link to='/'><img src={logo} alt="logo" className="logo" /></Link>
      </div>

      {/* Middle Search Bar */}
      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input type="text" placeholder="Search..." />
          <img src={search_icon} alt="search" className="search-icon" />
        </div>
      </div>

      {/* Right Icons */}
      <div className="nav-right flex-div">
        <img src={upload_icon} alt="upload" className="icon" />
        <img src={more_icon} alt="more" className="icon" />
        <img src={notification_icon} alt="notification" className="icon" />
        <img src={profile_icon} alt="profile" className="user-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
