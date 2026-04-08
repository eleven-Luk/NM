import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
    faEnvelope,
    faLocationDot,
    faHeart,
    faCamera,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className='flex flex-col md:flex-row w-full'>
            {/* Left Side Footer - Maple Street Photography */}
            <div className='w-full md:w-1/2 bg-gray-900 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-800'>
                <div className='max-w-2xl mx-auto'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8'>
                        <div>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faCamera} className='text-gray-300 text-lg' />
                                </div>
                                <h3 className='text-white font-medium text-base md:text-lg'>Maple Street</h3>
                            </div>
                            <p className='text-gray-400 text-xs md:text-sm leading-relaxed mb-4'>
                                Capturing life's most beautiful moments with authenticity and artistry. 
                                Specializing in newborn, maternity, and family milestones.
                            </p>
                            <div className='flex items-center gap-3'>
                                <a href="https://www.facebook.com/maplestreetphoto" target="_blank" rel="noopener noreferrer" 
                                   className='w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faFacebook} className='text-gray-400 text-sm' />
                                </a>
                                <a href="https://www.instagram.com/maplestreetphotography" target="_blank" rel="noopener noreferrer"
                                   className='w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faInstagram} className='text-gray-400 text-sm' />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className='text-white text-sm font-medium mb-4'>Quick Links</h4>
                            <ul className='space-y-2 mb-6'>
                                <li><Link to="/" className='text-gray-400 hover:text-white text-xs md:text-sm transition-colors'>Home</Link></li>
                                <li><Link to="/about-maple" className='text-gray-400 hover:text-white text-xs md:text-sm transition-colors'>About</Link></li>
                                <li><Link to="/samples" className='text-gray-400 hover:text-white text-xs md:text-sm transition-colors'>Samples</Link></li>
                                <li><Link to="/contact" className='text-gray-400 hover:text-white text-xs md:text-sm transition-colors'>Contact</Link></li>
                            </ul>
                            
                            <h4 className='text-white text-sm font-medium mb-4'>Contact Info</h4>
                            <div className='space-y-2'>
                                <p className='text-gray-400 text-xs md:text-sm flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faPhone} className='text-gray-500 text-xs w-4' />
                                    0916 170 1707
                                </p>
                                <p className='text-gray-400 text-xs md:text-sm flex items-center gap-2 break-all'>
                                    <FontAwesomeIcon icon={faEnvelope} className='text-gray-500 text-xs w-4' />
                                    neilaaronmaplephoto@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <p className='text-gray-500 text-xs text-center sm:text-left'>
                            © 2024 Maple Street Photography. All rights reserved.
                        </p>
                        <div className='flex items-center gap-4'>
                            <Link to="/maple-privacy-policy" className='text-gray-500 hover:text-gray-300 text-xs transition-colors'>Privacy Policy</Link>
                            <Link to="/maple-terms-of-service" className='text-gray-500 hover:text-gray-300 text-xs transition-colors'>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Footer - N&M Staffing Services */}
            <div className='w-full md:w-1/2 bg-orange-900 p-6 md:p-8'>
                <div className='max-w-2xl mx-auto'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8'>
                        <div>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='w-10 h-10 bg-orange-800 rounded-lg flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faUsers} className='text-orange-200 text-lg' />
                                </div>
                                <h3 className='text-white font-medium text-base md:text-lg'>N&M Staffing</h3>
                            </div>
                            <p className='text-orange-200 text-xs md:text-sm leading-relaxed mb-4'>
                                Connecting bilingual and multilingual professionals with premier career opportunities 
                                across the Philippines.
                            </p>
                            <div className='flex items-center gap-3'>
                                <a href="https://www.facebook.com/nmstaffingservices" target="_blank" rel="noopener noreferrer"
                                   className='w-8 h-8 bg-orange-800 hover:bg-orange-700 rounded-full flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faFacebook} className='text-orange-200 text-sm' />
                                </a>
                                <a href="https://www.linkedin.com/in/marie-kris-tupaz-64174025/" target="_blank" rel="noopener noreferrer"
                                   className='w-8 h-8 bg-orange-800 hover:bg-orange-700 rounded-full flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faLinkedin} className='text-orange-200 text-sm' />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className='text-white text-sm font-medium mb-4'>Quick Links</h4>
                            <ul className='space-y-2 mb-6'>
                                <li><Link to="/" className='text-orange-200 hover:text-white text-xs md:text-sm transition-colors'>Home</Link></li>
                                <li><Link to="/about-nm" className='text-orange-200 hover:text-white text-xs md:text-sm transition-colors'>About</Link></li>
                                <li><Link to="/jobs" className='text-orange-200 hover:text-white text-xs md:text-sm transition-colors'>Jobs</Link></li>
                                <li><Link to="/contact" className='text-orange-200 hover:text-white text-xs md:text-sm transition-colors'>Contact</Link></li>
                            </ul>
                            
                            <h4 className='text-white text-sm font-medium mb-4'>Contact Info</h4>
                            <div className='space-y-2'>
                                <p className='text-orange-200 text-xs md:text-sm flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faPhone} className='text-orange-300 text-xs w-4' />
                                    +63 976 503 0714
                                </p>
                                <p className='text-orange-200 text-xs md:text-sm flex items-center gap-2 break-all'>
                                    <FontAwesomeIcon icon={faEnvelope} className='text-orange-300 text-xs w-4' />
                                    multilingualhiring@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='pt-6 border-t border-orange-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <p className='text-orange-300 text-xs text-center sm:text-left'>
                            © 2020 N&M Staffing Services. All rights reserved.
                        </p>
                        <div className='flex items-center gap-4'>
                            <Link to="/nm-privacy-policy" className='text-orange-300 hover:text-white text-xs transition-colors'>Privacy Policy</Link>
                            <Link to="/nm-terms-of-service" className='text-orange-300 hover:text-white text-xs transition-colors'>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;