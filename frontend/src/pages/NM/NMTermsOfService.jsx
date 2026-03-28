import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faFileContract,
    faBriefcase,
    faHandshake,
    faUserCheck,
    faBan, 
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

function NMTermsOfService() {
    return (
        <div className='w-full bg-gradient-to-b from-orange-50 to-white py-16'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Header */}
                <div className='text-center mb-12'>
                    <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FontAwesomeIcon icon={faUsers} className='text-orange-500 text-3xl' />
                    </div>
                    <h1 className='text-3xl font-light text-orange-800 mb-3'>Terms of Service</h1>
                    <p className='text-orange-500'>N&M Staffing Services</p>
                    <p className='text-sm text-orange-400 mt-2'>Last Updated: March 8, 2026</p>
                </div>

                {/* Content Card */}
                <div className='bg-white rounded-xl shadow-lg border border-orange-100 p-8 mb-8'>
                    
                    {/* Introduction */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faFileContract} className='text-orange-400' />
                            Acceptance of Terms
                        </h2>
                        <p className='text-gray-600 leading-relaxed'>
                            By submitting your information, resume, or job applications through N&M Staffing Services, 
                            you agree to be bound by these Terms of Service. These terms govern the relationship between 
                            N&M Staffing, job applicants, and employer partners.
                        </p>
                    </div>

                    {/* For Job Applicants */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faUserCheck} className='text-orange-400' />
                            Terms for Job Applicants
                        </h2>
                        
                        <div className='space-y-4'>
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Information Submission</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    When you submit your information, resume, or apply for positions through us, you agree to provide accurate, current, and complete information. We collect and process your information solely for recruitment and placement purposes.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Application Accuracy</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    You certify that all information provided in your resume, application, and communications with us is true and accurate. Misrepresentation of qualifications, experience, or language skills may result in immediate disqualification from consideration for positions.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Communication</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    By submitting your information, you agree to receive communications from us via email, phone, or SMS regarding job opportunities, application status, and other recruitment-related matters.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>No Guarantee of Employment</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    While we work diligently to connect you with opportunities, we do not guarantee that you will be hired for any position. The final hiring decision rests with the employer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* For Employers */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-400' />
                            Terms for Employer Partners
                        </h2>
                        
                        <div className='space-y-4'>
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Job Postings</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Employers agree to provide accurate job descriptions, requirements, and compensation details. Any material changes to a position must be communicated promptly.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Non-Discrimination</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Employers agree to comply with all applicable laws regarding equal employment opportunity and non-discrimination. N&M Staffing reserves the right to decline partnerships with employers who violate these principles.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>Placement Fees</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Placement fees, if applicable, will be outlined in a separate service agreement. Employers are responsible for timely payment according to the terms specified.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bilingual Focus */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faHandshake} className='text-orange-400' />
                            Bilingual and Multilingual Focus
                        </h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            N&M Staffing specializes in connecting bilingual and multilingual talent with employers. You acknowledge that:
                        </p>
                        <ul className='list-disc pl-5 mt-2 text-gray-600 text-sm space-y-1'>
                            <li>Language proficiency may be tested or verified before placement</li>
                            <li>Self-reported language skills should accurately reflect your actual proficiency</li>
                            <li>Some positions may require specific language certifications or test scores</li>
                        </ul>
                    </div>

                    {/* Fees and Payment */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3'>Fees and Payment</h2>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>For Job Seekers</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Our services for job applicants are completely free. We do not charge candidates for registration, information submission, job matching, or placement. Any request for payment from a job seeker should be reported to us immediately.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className='font-medium text-orange-700 mb-2'>For Employers</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    Fees for employer services are outlined in your service agreement. All fees are in Philippine Peso (₱) and are subject to applicable taxes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confidentiality */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3'>Confidentiality</h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            Both parties agree to maintain the confidentiality of information shared during the recruitment process. This includes candidate details, employer requirements, and proprietary business information.
                        </p>
                    </div>

                    {/* Limitation of Liability */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3'>Limitation of Liability</h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            N&M Staffing acts as an intermediary between candidates and employers. We are not responsible for:
                        </p>
                        <ul className='list-disc pl-5 mt-2 text-gray-600 text-sm space-y-1'>
                            <li>Employment decisions made by employers</li>
                            <li>Conduct of employers or candidates during the hiring process</li>
                            <li>Employment conditions, compensation, or work environment at the hiring company</li>
                            <li>Disputes between candidates and employers after placement</li>
                        </ul>
                    </div>

                    {/* Termination */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faBan} className='text-orange-400' />
                            Termination of Services
                        </h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            We reserve the right to decline or discontinue providing our services to individuals or organizations for:
                        </p>
                        <ul className='list-disc pl-5 mt-2 text-gray-600 text-sm space-y-1'>
                            <li>Providing false or misleading information</li>
                            <li>Unprofessional conduct during the recruitment process</li>
                            <li>Violation of these Terms of Service</li>
                            <li>Any other reason that may harm our business or reputation</li>
                        </ul>
                    </div>

                    {/* Governing Law */}
                    <div className='mb-8'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3'>Governing Law</h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            These Terms shall be governed by the laws of the Republic of the Philippines. Any disputes shall be subject to the exclusive jurisdiction of the courts of Quezon City.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className='bg-orange-50 p-6 rounded-lg'>
                        <h2 className='text-xl font-medium text-orange-800 mb-3'>Questions?</h2>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <p className='text-gray-600 text-sm mt-3'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-orange-400 mr-2' />
                            multilingualhiring@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NMTermsOfService;