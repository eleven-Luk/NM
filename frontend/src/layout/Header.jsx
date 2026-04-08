import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faEnvelope, faHome, faChevronDown, faImage, faBriefcase, faCircleInfo, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import NielLogo from '../assets/NielLogo.jpg';
import NMLogo from '../assets/NM.png';
import UnifiedContactModal from '../components/modals/UnifiedContactModal.jsx';
import { Link } from 'react-router-dom';

function Header({ onHomeClick }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navItems = [
        { icon: faImage, label: 'Samples', link: '/samples', color: 'gray' },
        { icon: faHome, label: 'Home', action: onHomeClick, color: 'gray' },
        { icon: faCircleInfo, label: 'About', isDropdown: true, color: 'gray' },
        { icon: faEnvelope, label: 'Contact Us', action: () => setIsModalOpen(true), color: 'orange' },
        { icon: faBriefcase, label: 'Jobs', link: '/jobs', color: 'orange' },
    ];

    return (
        <div className='sticky top-0 bg-white z-50'>
            {/* Desktop Header */}
            {!isMobile ? (
                <div className='flex w-full shadow-sm border-b border-gray-200'>
                    {/* Maple Street Photography - Left Side */}
                    <div className='w-1/2 bg-gray-50 p-4 md:p-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 md:gap-3'>
                                <img 
                                    src={NielLogo} 
                                    alt="Niel Logo" 
                                    className='w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gray-300 object-cover' 
                                />
                                <div>
                                    <h1 className='text-base md:text-xl font-medium text-gray-700'>Maple Street</h1>
                                    <p className='text-xs text-gray-500'>Photography</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Section */}
                    <div className="relative flex items-center justify-center gap-2 md:gap-3 px-2 md:px-4 flex-1">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-orange-50 w-full"></div>

                        <div className='relative z-10 flex items-center gap-2 md:gap-5'>
                            <Link to="/samples" 
                                className='flex items-center gap-1 md:gap-2 bg-white hover:bg-gray-100 text-gray-700 px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg border-2 border-gray-200 whitespace-nowrap'
                            >
                                <FontAwesomeIcon icon={faImage} className='text-xs md:text-sm' />
                                <span className='hidden sm:inline'>Samples</span>
                            </Link>
                            
                            <button 
                                onClick={onHomeClick}
                                className='flex items-center gap-1 md:gap-2 bg-white hover:bg-gray-100 text-gray-700 px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg border-2 border-gray-200 whitespace-nowrap'
                            >
                                <FontAwesomeIcon icon={faHome} className='text-xs md:text-sm' />
                                <span className='hidden sm:inline'>Home</span>
                            </button>
                            
                            {/* About Dropdown */}
                            <div className='relative'>
                                <button
                                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                                    className='flex items-center gap-1 md:gap-2 bg-white hover:bg-gray-100 text-gray-700 px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg border-2 border-gray-200 whitespace-nowrap'
                                >
                                    <FontAwesomeIcon icon={faCircleInfo} className='text-xs md:text-sm' />
                                    <span className='hidden sm:inline'>About</span>
                                    <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                        
                                {isAboutDropdownOpen && (
                                    <div className='absolute top-full left-0 mt-2 w-44 md:w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50'>
                                        <Link to="/about-maple" className='block px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors' onClick={() => setIsAboutDropdownOpen(false)}>
                                            <div className='flex items-center gap-2'>
                                                <FontAwesomeIcon icon={faCamera} className='text-gray-500 text-xs md:text-sm' />
                                                <span className='text-sm'>Maple Street</span>
                                            </div>
                                        </Link>
                                        <Link to="/about-nm" className='block px-3 md:px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors' onClick={() => setIsAboutDropdownOpen(false)}>
                                            <div className='flex items-center gap-2'>
                                                <FontAwesomeIcon icon={faUsers} className='text-orange-500 text-xs md:text-sm' />
                                                <span className='text-sm'>N&M Staffing</span>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className='flex items-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg border-2 border-white whitespace-nowrap'
                            >
                                <FontAwesomeIcon icon={faEnvelope} className='text-xs md:text-sm' />
                                <span className='hidden sm:inline'>Contact Us</span>
                            </button>
                            
                            <Link to="/jobs" 
                                className='flex items-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 shadow-lg border-2 border-white whitespace-nowrap'
                            >
                                <FontAwesomeIcon icon={faBriefcase} className='text-xs md:text-sm' />
                                <span className='hidden sm:inline'>Jobs</span>
                            </Link>
                        </div>
                    </div>

                    {/* N&M Staffing Services - Right Side */}
                    <div className='w-1/2 bg-orange-50 p-4 md:p-6'>
                        <div className='flex items-center justify-end'>
                            <div className='flex items-center gap-2 md:gap-3'>
                                <div className='text-right'>
                                    <h1 className='text-base md:text-xl font-medium text-orange-700'>N&M Staffing</h1>
                                    <p className='text-xs text-orange-500'>Services</p>
                                </div>
                                <img 
                                    src={NMLogo} 
                                    alt="N&M Logo" 
                                    className='w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-orange-300 object-cover' 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Mobile Header */
                <div className='bg-white shadow-sm border-b border-gray-200'>
                    <div className='flex items-center justify-between p-4'>
                        <div className='flex items-center gap-2'>
                            <img src={NielLogo} alt="Logo" className='w-10 h-10 rounded-full border border-gray-300 object-cover' />
                            <div>
                                <h1 className='text-sm font-medium text-gray-700'>Maple Street</h1>
                                <p className='text-xs text-gray-500'>Photography</p>
                            </div>
                        </div>
                        
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className='p-2'>
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className='text-gray-600 text-xl' />
                        </button>
                    </div>
                    
                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className='border-t border-gray-200 py-2'>
                            {navItems.map((item, index) => (
                                item.isDropdown ? (
                                    <div key={index}>
                                        <button
                                            onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                                            className='w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50'
                                        >
                                            <div className='flex items-center gap-3'>
                                                <FontAwesomeIcon icon={item.icon} className='text-gray-500' />
                                                <span>{item.label}</span>
                                            </div>
                                            <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isAboutDropdownOpen && (
                                            <div className='bg-gray-50 pl-8'>
                                                <Link to="/about-maple" className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100' onClick={() => { setIsMobileMenuOpen(false); setIsAboutDropdownOpen(false); }}>
                                                    <FontAwesomeIcon icon={faCamera} className='text-gray-500' />
                                                    <span>Maple Street</span>
                                                </Link>
                                                <Link to="/about-nm" className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50' onClick={() => { setIsMobileMenuOpen(false); setIsAboutDropdownOpen(false); }}>
                                                    <FontAwesomeIcon icon={faUsers} className='text-orange-500' />
                                                    <span>N&M Staffing</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : item.link ? (
                                    <Link key={index} to={item.link} className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50' onClick={() => setIsMobileMenuOpen(false)}>
                                        <FontAwesomeIcon icon={item.icon} className='text-gray-500' />
                                        <span>{item.label}</span>
                                    </Link>
                                ) : (
                                    <button key={index} onClick={() => { item.action?.(); setIsMobileMenuOpen(false); }} className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50'>
                                        <FontAwesomeIcon icon={item.icon} className={item.color === 'orange' ? 'text-orange-500' : 'text-gray-500'} />
                                        <span>{item.label}</span>
                                    </button>
                                )
                            ))}
                            <div className='flex items-center gap-2 px-4 py-3 border-t border-gray-200 mt-2'>
                                <img src={NMLogo} alt="NM Logo" className='w-8 h-8 rounded-full border border-orange-300 object-cover' />
                                <div>
                                    <h1 className='text-sm font-medium text-orange-700'>N&M Staffing</h1>
                                    <p className='text-xs text-orange-500'>Services</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <UnifiedContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default Header;