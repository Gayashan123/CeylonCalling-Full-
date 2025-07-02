import React, { useState } from 'react';
import { Link } from 'react-scroll';
import Login from './Login';
import Create from './Create';
import Logo from "../assets/Lion.jpg";

import {useNavigate } from 'react-router-dom';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

    const navigate = useNavigate();

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setIsMenuOpen(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setIsMenuOpen(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const navLinks = ['header', 'about', 'contact', 'services'];

  return (
    <div className={`relative top-0 left-0 z-30 w-full ${showLogin || showSignup ? 'bg-black opacity-75' : ''}`}>
      <div className='flex items-center justify-between px-6 py-4 mx-auto bg-white lg:px-20'>
        <div className='flex items-center gap-4'>
         <img
                     src={Logo}
                     alt="Logo"
                     className="h-12 w-12 rounded-full object-cover shadow-teal-200 shadow-md"
                   />
                   <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                     Ceylon Calling
                   </span>
        </div>

        {/* Desktop Menu */}
        <div className='hidden lg:flex items-center gap-6 ml-auto'>
          <ul className='flex text-black gap-7'>
            {navLinks.map((section) => (
              <li key={section}>
                <Link
                  to={section}
                  smooth
                  duration={500}
                  spy
                  activeClass="text-red-500"
                  className='cursor-pointer hover:text-gray-400 capitalize'
                >
                  {section === 'services' ? 'Restaurants' : section}
                </Link>
              </li>
            ))}
          </ul>
          <div className='flex gap-4'>
            <button
              className='px-6 py-2 font-semibold text-gray-800 uppercase bg-white rounded-xl hover:bg-gray-200'
              onClick={openLogin}
            >
              Log in
            </button>
            <button
              className='px-6 py-2 font-semibold text-gray-800 uppercase bg-red-300 rounded-xl hover:bg-gray-200'
              onClick={() => navigate("/shop")}
            >
              Shop
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className='lg:hidden'>
          <button className='text-black' onClick={handleMenuToggle}>
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && !showLogin && !showSignup && (
        <div className="absolute z-40 w-full px-5 py-5 text-white bg-black opacity-90 rounded-xl lg:hidden">
          <ul className="flex flex-col items-center gap-4 uppercase py-4">
            {navLinks.map((section) => (
              <li key={section}>
                <Link
                  to={section}
                  smooth
                  duration={500}
                  spy
                  activeClass="text-red-500"
                  className="cursor-pointer hover:text-gray-400 capitalize"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section === 'services' ? 'Restaurants' : section}
                </Link>
              </li>
            ))}
          </ul>

          <div className='flex justify-center gap-4 mt-6'>
            <button
              className='px-6 py-2 font-semibold text-gray-800 uppercase bg-white rounded-full hover:bg-gray-200'
             onClick={() => navigate("/userlogui")}
            >
              User Log in
            </button>
            <button
              className='px-6 py-2 font-semibold text-gray-800 uppercase bg-white rounded-full hover:bg-gray-200'
              onClick={() => navigate("/shopform")}
            >
              Shop Login
            </button>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {showLogin && <Login closeLogin={closeModals} signup={openSignup} />}
      {showSignup && <Create closeLogin={closeModals} login={openLogin} />}
    </div>
  );
}

export default Navigation;
