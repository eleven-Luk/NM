import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faBriefcase, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ChoosePage(){
    const navigate = useNavigate();
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
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3 sm:p-4">

            <div className="max-w-2xl w-full">
                {/* Decorative header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-1 sm:mb-2">Welcome, Admin</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Choose your dashboard to continue</p>
                </div>

                {/* Card container - Responsive grid */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Maple Admin Card */}
                    <div 
                        onClick={() => navigate('/maple-admin')}
                        className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-gray-200 transition-colors">
                            <FontAwesomeIcon icon={faLeaf} className="text-xl sm:text-2xl text-gray-600" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-1 sm:mb-2">Maple Street</h2>
                        <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                            Photography appointments, samples, schedules, and client concerns.
                        </p>
                        <div className="flex items-center text-gray-600 text-xs sm:text-sm font-medium group-hover:text-gray-800 transition-colors">
                            <span>Enter dashboard</span>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* N&M Admin Card */}
                    <div 
                        onClick={() => navigate('/nm-admin')}
                        className="group cursor-pointer bg-white rounded-xl border border-amber-200 p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-100 flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-amber-200 transition-colors">
                            <FontAwesomeIcon icon={faBriefcase} className="text-xl sm:text-2xl text-amber-700" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-medium text-amber-900 mb-1 sm:mb-2">N&M Staffing</h2>
                        <p className="text-amber-700 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">
                            Job postings, applicant tracking, and staffing concerns management.
                        </p>
                        <div className="flex items-center text-amber-700 text-xs sm:text-sm font-medium group-hover:text-amber-800 transition-colors">
                            <span>Enter dashboard</span>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-gray-400 text-xs mt-6 sm:mt-8">
                    Select the admin panel you'd like to manage
                </p>
            </div>
        </div>
    )
}

export default ChoosePage;