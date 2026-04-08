import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faShield,
    faFileAlt,
    faUserLock,
    faEnvelope,
    faPhone,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

function NMPrivacyPolicy() {
    const navigate = useNavigate();

    const goToHomepage = () => {
        navigate('/main');
    };

    return (
        <div className='w-full bg-gradient-to-b from-orange-50 to-white py-8 sm:py-12 md:py-16'>
            {/* Back to Homepage Button */}
            <div className='fixed top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20'>
                <button
                    onClick={goToHomepage}
                    className='flex items-center gap-1 sm:gap-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-md transition-all duration-300 border border-gray-200 text-xs sm:text-sm'
                >
                    <FontAwesomeIcon icon={faArrowLeft} className='w-3 h-3 sm:w-4 sm:h-4' />
                    <span className='hidden sm:inline'>Back to Home</span>
                    <span className='sm:hidden'>Home</span>
                </button>
            </div>

            <div className='max-w-4xl mx-auto px-4 sm:px-6'>
                {/* Header */}
                <div className='text-center mb-8 sm:mb-12'>
                    <div className='w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                        <FontAwesomeIcon icon={faUsers} className='text-orange-500 text-2xl sm:text-3xl' />
                    </div>
                    <h1 className='text-2xl sm:text-3xl font-light text-orange-800 mb-2 sm:mb-3'>Privacy Policy</h1>
                    <p className='text-orange-500 text-sm sm:text-base'>N&M Staffing Services</p>
                    <p className='text-xs sm:text-sm text-orange-400 mt-2'>Last Updated: March 8, 2026</p>
                </div>

                {/* Content Card */}
                <div className='bg-white rounded-xl shadow-lg border border-orange-100 p-5 sm:p-6 md:p-8 mb-8'>
                    
                    {/* Introduction */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faShield} className='text-orange-400 text-sm sm:text-base' />
                            Our Commitment to Your Privacy
                        </h2>
                        <p className='text-gray-600 leading-relaxed text-sm sm:text-base'>
                            At N&M Staffing Services, we are committed to protecting the privacy and security of your personal information. 
                            This policy explains how we collect, use, and safeguard your data when you apply for jobs, register with us, 
                            or use our services.
                        </p>
                    </div>

                    {/* Information We Collect */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>Information We Collect</h2>
                        <div className='space-y-3 sm:space-y-4'>
                            <div>
                                <h3 className='font-medium text-orange-700 mb-1 sm:mb-2 text-sm sm:text-base'>Job Applicant Information</h3>
                                <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                                    When you apply for a position through our services, we collect:
                                </p>
                                <ul className='list-disc pl-5 mt-2 text-gray-600 text-xs sm:text-sm space-y-1'>
                                    <li>Full name and contact details (email, phone number, address)</li>
                                    <li>Resume/CV, cover letter, and work history</li>
                                    <li>Educational background and professional certifications</li>
                                    <li>Language skills and proficiency levels</li>
                                    <li>References and recommendations</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-1 sm:mb-2 text-sm sm:text-base'>Employer Information</h3>
                                <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                                    For our partner companies, we collect:
                                </p>
                                <ul className='list-disc pl-5 mt-2 text-gray-600 text-xs sm:text-sm space-y-1'>
                                    <li>Company name and business registration details</li>
                                    <li>Contact person information</li>
                                    <li>Job requirements and position details</li>
                                    <li>Payment and billing information</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Your Information */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>How We Use Your Information</h2>
                        <ul className='list-disc pl-5 text-gray-600 text-xs sm:text-sm space-y-1.5 sm:space-y-2'>
                            <li>To match candidates with suitable job opportunities</li>
                            <li>To present qualified candidates to our partner employers</li>
                            <li>To communicate about job applications and interviews</li>
                            <li>To verify your qualifications and language proficiency</li>
                            <li>To improve our recruitment and matching services</li>
                            <li>To comply with legal and regulatory requirements</li>
                        </ul>
                    </div>

                    {/* Information Sharing */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>Information Sharing</h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed mb-2'>
                            We share your information only in these specific circumstances:
                        </p>
                        <ul className='list-disc pl-5 text-gray-600 text-xs sm:text-sm space-y-1.5 sm:space-y-2'>
                            <li><span className='font-medium'>With Employers:</span> When you apply for a position, we share your application materials with the relevant employer</li>
                            <li><span className='font-medium'>Service Providers:</span> Third parties that help us operate our business (background check services, IT providers)</li>
                            <li><span className='font-medium'>Legal Requirements:</span> When required by law or to protect our legal rights</li>
                        </ul>
                        <p className='text-gray-600 text-xs sm:text-sm mt-3 font-medium'>
                            We never sell your personal information to third parties.
                        </p>
                    </div>

                    {/* Data Security */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faUserLock} className='text-orange-400 text-sm sm:text-base' />
                            Data Security
                        </h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                            We implement strict security measures to protect your personal information, including encryption, 
                            access controls, and secure servers. Your resume and personal details are accessible only to authorized 
                            personnel and partner employers with legitimate business needs.
                        </p>
                    </div>

                    {/* Data Retention */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faFileAlt} className='text-orange-400 text-sm sm:text-base' />
                            Data Retention
                        </h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                            We retain your information for as long as necessary to provide our services and as required by law. 
                            If you would like us to delete your information from our systems, please contact us.
                        </p>
                    </div>

                    {/* Your Rights */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>Your Rights</h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed mb-2'>
                            As a job applicant, you have the right to:
                        </p>
                        <ul className='list-disc pl-5 text-gray-600 text-xs sm:text-sm space-y-1'>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate or incomplete information</li>
                            <li>Request deletion of your information (subject to legal obligations)</li>
                            <li>Withdraw consent for us to share your information with employers</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </div>

                    {/* Changes to Policy */}
                    <div className='mb-6 sm:mb-8'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>Changes to This Policy</h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                            We may update this privacy policy to reflect changes in our practices or legal requirements. 
                            We will notify you of significant changes through our website or via email.
                        </p>
                    </div>

                    {/* Contact Us */}
                    <div className='bg-orange-50 p-4 sm:p-6 rounded-lg'>
                        <h2 className='text-base sm:text-lg md:text-xl font-medium text-orange-800 mb-3'>Contact Our Data Protection Officer</h2>
                        <p className='text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4'>
                            If you have questions about this privacy policy or wish to exercise your rights, please contact:
                        </p>
                        <div className='space-y-2'>
                            <p className='text-gray-600 text-xs sm:text-sm flex items-center gap-2 break-all'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-orange-400 w-4' />
                                multilingualhiring@gmail.com
                            </p>
                            <p className='text-gray-600 text-xs sm:text-sm flex items-center gap-2'>
                                <FontAwesomeIcon icon={faPhone} className='text-orange-400 w-4' />
                                +63 (2) 9876 5432
                            </p>
                            <p className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
                                Blk 4 Lot 3, West Classic Garden, Sauyo, <br />
                                Novaliches, Quezon City, 1116 Metro Manila
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NMPrivacyPolicy;