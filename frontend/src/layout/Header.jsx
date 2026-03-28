import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faEnvelope, faHome, faChevronDown, faImage, faBriefcase, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import NielLogo from '../assets/NielLogo.jpg';
import NMLogo from '../assets/NM.png';
import UnifiedContactModal from '../components/modals/UnifiedContactModal.jsx';
import { Link } from 'react-router-dom';

function Header({ onHomeClick }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    
    return (
        <div className='sticky top-0 bg-white z-50'>
            <div className='flex w-full shadow-sm border-b border-gray-200'>
                {/* Maple Street Photography - Left Side (Soft Gray) */}
                <div className='w-1/2 bg-gray-50 p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <img 
                                    src={NielLogo} 
                                    alt="Niel Logo" 
                                    className='w-16 h-16 rounded-full border-2 border-gray-300 object-cover' 
                                />
                            </div>
                            <div>
                                <h1 className='text-xl font-medium text-gray-700'>Maple Street</h1>
                                <p className='text-xs text-gray-500'>Photography</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Section with Home and Contact Buttons */}
                <div className="relative flex items-center justify-center gap-3 px-4">
                    {/* Gradient background that transitions from gray to orange */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-orange-50 w-full"></div>

                    <div className='relative z-10'>
                        <div className='flex items-center gap-5'>
                            <Link to="/samples" 
                            className='flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-200 whitespace-nowrap'
                        >
                        <FontAwesomeIcon icon={faImage} className='text-sm' />
                            Samples</Link>
                        </div>
                    </div>
                    
                    {/* Home Button */}
                    <div className="relative z-10">
                        <button 
                            onClick={onHomeClick}
                            className='flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-200 whitespace-nowrap'
                        >
                            <FontAwesomeIcon icon={faHome} className='text-sm' />
                            Home
                        </button>
                    </div>
                    
                    {/* About Button - dropdown */}
                    <div className='relative z-10'>
                        <button
                            onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                            className='flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-gray-200 whitespace-nowrap'
                        >
                        <FontAwesomeIcon icon={faCircleInfo} className='text-sm' />
                        About
                            <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                                    
                        {/* About Dropdown Menu */}
                        {isAboutDropdownOpen && (
                        <div className='absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50'>
                        <Link
                            to="/about-maple"
                            className='block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors'
                            onClick={() => setIsAboutDropdownOpen(false)}
                        >
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faCamera} className='text-gray-500 text-sm' />
                            <span>Maple Street</span>
                        </div>
                        </Link>
                        <Link
                            to="/about-nm"
                            className='block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors'
                            onClick={() => setIsAboutDropdownOpen(false)}
                        >
                        <div className='flex items-center gap-2'>
                            <FontAwesomeIcon icon={faUsers} className='text-orange-500 text-sm' />
                                <span>N&M Staffing</span>
                        </div>
                        </Link>
                        </div>
                        )}
                    </div>

                    {/* Contact Button */}
                    <div className="relative z-10">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white whitespace-nowrap'
                        >
                            <FontAwesomeIcon icon={faEnvelope} className='text-sm' />
                            Contact Us
                        </button>
                    </div>
                    
                    <div className='relative z-10'>
                        <div className='flex items-center gap-5'>
                            <Link to="/jobs" 
                            className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white whitespace-nowrap'
                            >
                            <FontAwesomeIcon icon={faBriefcase} className='text-sm' />
                                Jobs
                            </Link>
                        </div>
                    </div>
                </div>

                {/* N&M Staffing Services - Right Side (Soft Peach) */}
                <div className='w-1/2 bg-orange-50 p-6'>
                    <div className='flex items-center justify-end'>
                        <div className='flex items-center gap-3'>
                            <div className='text-right'>
                                <h1 className='text-xl font-medium text-orange-700'>N&M Staffing</h1>
                                <p className='text-xs text-orange-500'>Services</p>
                            </div>
                            <div className='relative'>
                                <img 
                                    src={NMLogo} 
                                    alt="N&M Logo" 
                                    className='w-16 h-16 rounded-full border-2 border-orange-300 object-cover' 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unified Contact Modal */}
            <UnifiedContactModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default Header;