import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faBriefcase, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function ChoosePage(){
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-white flex items-center justify-center p-4">    
            <div className="max-w-2xl w-full">
                {/* Decorative header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light text-stone-800 mb-2">Welcome, Admin</h1>
                    <p className="text-stone-500">Choose your dashboard to continue</p>
                </div>

                {/* Card container */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Maple Admin Card - Soft gray theme */}
                    <div 
                        onClick={() => navigate('/maple-admin')}
                        className="group cursor-pointer bg-white rounded-xl border border-stone-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mb-5 group-hover:bg-stone-200 transition-colors">
                            <FontAwesomeIcon icon={faLeaf} className="text-2xl text-stone-600" />
                        </div>
                        <h2 className="text-2xl font-medium text-stone-800 mb-2">Maple Street</h2>
                        <p className="text-stone-500 text-sm mb-5 leading-relaxed">
                            Photography appointments, samples, schedules, and client concerns.
                        </p>
                        <div className="flex items-center text-stone-600 text-sm font-medium group-hover:text-stone-800 transition-colors">
                            <span>Enter dashboard</span>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* N&M Admin Card - Warm earth tone theme */}
                    <div 
                        onClick={() => navigate('/nm-admin')}
                        className="group cursor-pointer bg-white rounded-xl border border-amber-200 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-5 group-hover:bg-amber-200 transition-colors">
                            <FontAwesomeIcon icon={faBriefcase} className="text-2xl text-amber-700" />
                        </div>
                        <h2 className="text-2xl font-medium text-amber-900 mb-2">N&M Staffing</h2>
                        <p className="text-amber-700 text-sm mb-5 leading-relaxed">
                            Job postings, applicant tracking, and staffing concerns management.
                        </p>
                        <div className="flex items-center text-amber-700 text-sm font-medium group-hover:text-amber-800 transition-colors">
                            <span>Enter dashboard</span>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-stone-400 text-xs mt-8">
                    Select the admin panel you'd like to manage
                </p>
            </div>
        </div>
    )
}

export default ChoosePage;