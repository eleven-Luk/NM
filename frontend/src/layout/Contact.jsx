import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
    faEnvelope,
    faLocationDot,
    faClock,
    faMessage,
    faCamera,
    faUsers,
    faMapLocationDot,
    faDirections,
    faBuilding,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import UnifiedContactModal from '../components/modals/UnifiedContactModal';

function CenteredContact() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className='w-full bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16'>
            <div className='max-w-6xl mx-auto px-3 sm:px-4'>
                {/* Header */}
                <div className='text-center mb-8 sm:mb-12'>
                    <h2 className='text-2xl sm:text-3xl font-light text-gray-800 mb-2 sm:mb-3'>Get in Touch</h2>
                    <p className='text-gray-500 text-sm sm:text-base max-w-2xl mx-auto px-4'>
                        We're here to help with your photography needs or career opportunities.
                    </p>
                </div>

                {/* Centered Map Section */}
                <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 sm:mb-12 max-w-5xl mx-auto'>
                    
                    {/* Map Header */}
                    <div className='bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4 text-white'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faMapLocationDot} className='text-white text-sm sm:text-base' />
                                </div>
                                <div>
                                    <h3 className='font-medium text-base sm:text-lg'>West Classic Gardens</h3>
                                    <p className='text-xs sm:text-sm text-orange-100'>Fairview, Quezon City</p>
                                </div>
                            </div>
                            <a 
                                href="https://www.google.com/maps/dir/?api=1&destination=14.703182,121.054868"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2 self-start sm:self-center'
                            >
                                <FontAwesomeIcon icon={faDirections} />
                                Get Directions
                            </a>
                        </div>
                    </div>

                    {/* Google Maps Iframe */}
                    <div className="w-full h-56 sm:h-64 md:h-80">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.388325349825!2d121.05486827597389!3d14.703181785756178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1001ac4abd1%3A0x2d87e5cd6215cf27!2sBlk%204%20Lot%203%2C%20West%20Classic%20Garden%20Homes%2C%20Sauyo%2C%20Novaliches%2C%20Quezon%20City%2C%201116%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="N&M Staffing Services Location"
                            className="w-full h-full"
                        />
                    </div>

                    {/* Location Info Bar */}
                    <div className='bg-gray-50 p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                            <div className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faLocationDot} className='text-orange-500 text-xs sm:text-sm' />
                                <span className='text-xs sm:text-sm text-gray-600'>Novaliches, Quezon City</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FontAwesomeIcon icon={faBuilding} className='text-gray-400 text-xs sm:text-sm' />
                                <span className='text-xs sm:text-sm text-gray-600'>Block 3 Lot 16, Unit A, 2/F West Classic Gardens</span>
                            </div>
                        </div>
                        <div>
                            <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full'>
                                Open Now
                            </span>
                        </div>
                    </div>

                    {/* Two Business Cards */}
                    <div className='grid md:grid-cols-2 gap-0 border-t border-gray-200'>
                        {/* Maple Street Photography */}
                        <div className='p-4 sm:p-6 border-r border-gray-200 bg-white'>
                            <div className='flex items-center gap-3 mb-4 sm:mb-5'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faCamera} className='text-gray-600 text-base sm:text-xl' />
                                </div>
                                <div>
                                    <h3 className='text-lg sm:text-xl font-medium text-gray-800'>Maple Street</h3>
                                    <p className='text-xs text-gray-500'>Photography</p>
                                </div>
                            </div>

                            <div className='mb-4 sm:mb-5'>
                                <h4 className='text-xs uppercase tracking-wider text-gray-400 mb-2 sm:mb-3'>Contact</h4>
                                <div className='space-y-2 sm:space-y-3'>
                                    <div className='flex items-center gap-3 text-xs sm:text-sm'>
                                        <div className='w-5 sm:w-6 text-center'>
                                            <FontAwesomeIcon icon={faPhone} className='text-gray-400' />
                                        </div>
                                        <span className='text-gray-600'>0916 170 1707</span>
                                    </div>
                                    <div className='flex items-center gap-3 text-xs sm:text-sm break-all'>
                                        <div className='w-5 sm:w-6 text-center'>
                                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400' />
                                        </div>
                                        <span className='text-gray-600'>neilaaronmaplephoto@gmail.com</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className='text-xs uppercase tracking-wider text-gray-400 mb-2 sm:mb-3'>Studio Hours</h4>
                                <div className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-500'>Mon - Fri</span>
                                        <span className='text-gray-700 font-medium'>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-500'>Saturday</span>
                                        <span className='text-gray-700 font-medium'>10:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-500'>Sunday</span>
                                        <span className='text-gray-700 font-medium'>By Appointment</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* N&M Staffing Services */}
                        <div className='p-4 sm:p-6 bg-orange-50/30'>
                            <div className='flex items-center gap-3 mb-4 sm:mb-5'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faUsers} className='text-orange-500 text-base sm:text-xl' />
                                </div>
                                <div>
                                    <h3 className='text-lg sm:text-xl font-medium text-orange-800'>N&M Staffing</h3>
                                    <p className='text-xs text-orange-500'>Services</p>
                                </div>
                            </div>

                            <div className='mb-4 sm:mb-5'>
                                <h4 className='text-xs uppercase tracking-wider text-orange-400 mb-2 sm:mb-3'>Contact</h4>
                                <div className='space-y-2 sm:space-y-3'>
                                    <div className='flex items-center gap-3 text-xs sm:text-sm'>
                                        <div className='w-5 sm:w-6 text-center'>
                                            <FontAwesomeIcon icon={faPhone} className='text-orange-400' />
                                        </div>
                                        <span className='text-orange-700'>+63 (2) 9876 5432</span>
                                    </div>
                                    <div className='flex items-center gap-3 text-xs sm:text-sm break-all'>
                                        <div className='w-5 sm:w-6 text-center'>
                                            <FontAwesomeIcon icon={faEnvelope} className='text-orange-400' />
                                        </div>
                                        <span className='text-orange-700'>multilingualhiring@gmail.com</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className='text-xs uppercase tracking-wider text-orange-400 mb-2 sm:mb-3'>Office Hours</h4>
                                <div className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-orange-500'>Mon - Fri</span>
                                        <span className='text-orange-700 font-medium'>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-orange-500'>Saturday</span>
                                        <span className='text-orange-700 font-medium'>Closed</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-orange-500'>Sunday</span>
                                        <span className='text-orange-700 font-medium'>Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Section */}
                    <div className='border-t border-gray-200 p-4 sm:p-6 text-center bg-gradient-to-b from-white to-gray-50'>
                        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                            <FontAwesomeIcon icon={faMessage} className='text-orange-500 text-xl sm:text-2xl' />
                        </div>
                        <h3 className='text-xl sm:text-2xl font-light text-gray-800 mb-2 sm:mb-3'>Send Us a Message</h3>
                        <p className='text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto'>
                            Have questions? Want to book a session or apply for a job? We'd love to hear from you.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg'
                        >
                            <FontAwesomeIcon icon={faMessage} />
                            Open Contact Form
                            <FontAwesomeIcon icon={faChevronRight} className='text-xs' />
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className='text-center text-xs text-gray-400 mt-4 sm:mt-6 px-4'>
                    Both businesses share the same location at West Classic Gardens, Quezon City. 
                    Feel free to contact either business directly using the information above.
                </p>
            </div>

            <UnifiedContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default CenteredContact;