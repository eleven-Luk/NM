import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faGlobe,
    faHandshake,
    faChartLine,
    faTrophy,
    faBullseye,
    faEye,
    faHeart,
    faBriefcase,
    faLanguage,
    faQuoteRight, 
    faArrowRight,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

// Import images
import NMLogo from '../../assets/NM.png';
import TeamPic from '../../assets/teampic2-NM.jpg';
import CandidateFeedBack1 from '../../assets/feedback1.jpg';
import CandidateFeedBack2 from '../../assets/feedback2.jpg';
import CandidateFeedBack3 from '../../assets/feedback3.jpg';

function AboutNM() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const goToHomepage = () => {
        window.location.href = '/main';
    };

    const goToJobs = () => {
        window.location.href = '/jobs';
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white'>
            {/* Back to Homepage Button - Fixed */}
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
            
            {/* Button for Jobs */}
            <div className='fixed top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20'>
                <button
                    onClick={goToJobs}
                    className='flex items-center gap-1 sm:gap-2 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-md transition-all duration-300 border border-gray-200 text-xs sm:text-sm'
                >
                    <span className='hidden sm:inline'>View Jobs</span>
                    <FontAwesomeIcon icon={faArrowRight} className='w-3 h-3 sm:w-4 sm:h-4' />
                </button>
            </div>

            {/* Hero Section - Responsive */}
            <div className='relative bg-gradient-to-r from-orange-600 to-orange-700 text-white overflow-hidden pt-16 sm:pt-20'>
                <div className='absolute inset-0 opacity-70'>
                    <div className='absolute bottom-4 sm:bottom-10 right-4 sm:right-10 text-7xl sm:text-9xl text-gray-300'>💼</div>
                </div>
                
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10'>
                    <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
                        <img 
                            src={NMLogo} 
                            alt="N&M Staffing Logo" 
                            className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-xl object-cover'
                        />
                        <div className='text-center sm:text-left'>
                            <h1 className='text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2'>N&M Staffing Services</h1>
                            <p className='text-orange-100 text-sm sm:text-base md:text-lg'>Bridging Talent • Connecting Cultures</p>
                        </div>
                    </div>
                    <div className='w-16 sm:w-24 h-0.5 bg-white mb-4 sm:mb-8 mx-auto sm:mx-0'></div>
                    <p className='text-base sm:text-lg md:text-xl text-orange-100 max-w-3xl leading-relaxed px-2 sm:px-0'>
                        We connect bilingual and multilingual professionals with premier career opportunities 
                        across the Philippines. Since 2020, we've been the bridge between exceptional talent 
                        and forward-thinking companies.
                    </p>
                </div>
            </div>

            {/* Our Story Section - Responsive */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16'>
                <div className='grid md:grid-cols-2 gap-8 sm:gap-12 items-center'>
                    <div className='order-2 md:order-1'>
                        <h2 className='text-2xl sm:text-3xl font-light text-orange-800 mb-3 sm:mb-4'>Our Story</h2>
                        <div className='w-16 h-0.5 bg-orange-400 mb-4 sm:mb-6'></div>
                        <p className='text-orange-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base'>
                            Founded in 2020 by Marie Kris Tupaz, N&M Staffing Services was born from a vision: 
                            to create meaningful connections between multilingual professionals and companies seeking 
                            diverse perspectives. What started as a small recruitment firm has grown into a trusted 
                            partner for BPOs, multinational corporations, and global enterprises.
                        </p>
                        <p className='text-orange-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base'>
                            Headquartered in West Classic, Novaliches Quezon City, we've successfully placed hundreds of candidates 
                            in roles spanning customer service, IT, finance, healthcare, and more. Our expertise lies 
                            in understanding not just language proficiency, but cultural nuance — ensuring the perfect 
                            fit for both employer and employee.
                        </p>
                        <p className='text-orange-700 leading-relaxed text-sm sm:text-base'>
                            We believe that language is more than a skill — it's a bridge to opportunity. Whether you're 
                            a job seeker looking for your next career move or an employer seeking top-tier bilingual talent, 
                            we're here to guide you every step of the way.
                        </p>
                    </div>
                    <div className='relative order-1 md:order-2'>
                        <img 
                            src={TeamPic} 
                            alt="N&M Staffing Team" 
                            className='rounded-xl shadow-xl w-full h-64 sm:h-80 md:h-96 object-cover'
                        />
                        <div className='absolute -bottom-3 sm:-bottom-5 -left-3 sm:-left-5 bg-white p-2 sm:p-4 rounded-lg shadow-lg border-l-4 border-orange-500'>
                            <p className='text-orange-800 font-medium text-sm sm:text-base'>200+ Placements</p>
                            <p className='text-xs sm:text-sm text-gray-500'>And Growing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision - Responsive */}
            <div className='bg-orange-100 py-12 sm:py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <div className='grid md:grid-cols-2 gap-6 sm:gap-8'>
                        <div className='bg-white p-6 sm:p-8 rounded-xl shadow-md relative border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300'>
                            <div className='w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6'>
                                <FontAwesomeIcon icon={faBullseye} className='text-orange-600 text-xl sm:text-2xl' />
                            </div>
                            <h3 className='text-xl sm:text-2xl font-light text-orange-800 mb-3 sm:mb-4'>Our Mission</h3>
                            <p className='text-orange-700 leading-relaxed text-sm sm:text-base'>
                                To empower bilingual and multilingual professionals by connecting them with 
                                meaningful career opportunities that leverage their unique language skills, 
                                while helping companies build diverse, culturally-rich teams that drive innovation 
                                and global success.
                            </p>
                        </div>
                        
                        <div className='bg-white p-6 sm:p-8 rounded-xl shadow-md relative border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300'>
                            <div className='w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 sm:mb-6'>
                                <FontAwesomeIcon icon={faEye} className='text-orange-600 text-xl sm:text-2xl' />
                            </div>
                            <h3 className='text-xl sm:text-2xl font-light text-orange-800 mb-3 sm:mb-4'>Our Vision</h3>
                            <p className='text-orange-700 leading-relaxed text-sm sm:text-base'>
                                To be the Philippines' leading recruitment partner for multilingual talent, 
                                recognized for our deep understanding of language markets, our commitment to 
                                candidate success, and our ability to bridge cultures in the workplace.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values - Responsive */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16'>
                <h2 className='text-2xl sm:text-3xl font-light text-orange-800 mb-3 sm:mb-4 text-center'>Our Core Values</h2>
                <div className='w-20 sm:w-30 h-0.5 bg-orange-400 mb-8 sm:mb-12 mx-auto'></div>
                
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    <div className='bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
                            <FontAwesomeIcon icon={faGlobe} className='text-orange-600 text-base sm:text-xl' />
                        </div>
                        <h3 className='text-base sm:text-lg font-medium text-orange-800 mb-1 sm:mb-2'>Cultural Bridge</h3>
                        <p className='text-orange-600 text-xs sm:text-sm'>
                            We understand that language is tied to culture. We don't just match words — we match 
                            understanding, values, and workplace dynamics.
                        </p>
                    </div>
                    
                    <div className='bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
                            <FontAwesomeIcon icon={faHandshake} className='text-orange-600 text-base sm:text-xl' />
                        </div>
                        <h3 className='text-base sm:text-lg font-medium text-orange-800 mb-1 sm:mb-2'>Integrity</h3>
                        <p className='text-orange-600 text-xs sm:text-sm'>
                            We operate with transparency and honesty, ensuring both candidates and employers 
                            have clear expectations and accurate information.
                        </p>
                    </div>
                    
                    <div className='bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
                            <FontAwesomeIcon icon={faChartLine} className='text-orange-600 text-base sm:text-xl' />
                        </div>
                        <h3 className='text-base sm:text-lg font-medium text-orange-800 mb-1 sm:mb-2'>Excellence</h3>
                        <p className='text-orange-600 text-xs sm:text-sm'>
                            We strive for excellence in every placement, taking the time to understand 
                            the unique needs of each candidate and company we serve.
                        </p>
                    </div>
                </div>
            </div>

            {/* Languages We Serve - Responsive */}
            <div className='bg-orange-50 py-8 sm:py-12'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <h2 className='text-2xl sm:text-3xl font-light text-orange-800 mb-3 sm:mb-4 text-center'>Languages We Specialize In</h2>
                    <div className='w-48 sm:w-60 h-0.5 bg-orange-400 mb-8 sm:mb-10 mx-auto'></div>
                    
                    <div className='flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto'>
                        {['Japanese', 'Mandarin', 'Korean', 'Spanish', 'Cantonese', 'Portuguese', 'English', 'Local Filipino'].map(lang => (
                            <span key={lang} className='px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-orange-200 rounded-full text-orange-700 text-xs sm:text-sm hover:bg-orange-500 hover:text-white transition-colors cursor-default'>
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Candidate Feedback Section - Responsive */}
            <div className='bg-orange-50 py-12 sm:py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <h2 className='text-2xl sm:text-3xl font-light text-orange-800 mb-3 sm:mb-4 text-center'>Candidate Feedback</h2>
                    <div className='w-32 sm:w-40 h-0.5 bg-orange-400 mb-8 sm:mb-12 mx-auto'></div>
                    
                    <div className='grid md:grid-cols-3 gap-4 sm:gap-6'>
                        {/* Feedback 1 */}
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <img 
                                src={CandidateFeedBack1} 
                                alt="Candidate Feedback" 
                                className='w-full h-40 sm:h-48 md:h-52 object-cover'
                            />
                            <div className='p-3 sm:p-4'>
                                <div className='flex items-center gap-0.5 sm:gap-1 text-orange-400 mb-1 sm:mb-2 text-xs sm:text-sm'>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                                <p className='text-orange-700 text-xs sm:text-sm italic line-clamp-3'>
                                    "N&M Staffing helped me find the perfect Japanese-speaking role. The team understood my skills and matched me with a company that values cultural fit."
                                </p>
                                <p className='text-xs text-orange-500 mt-2 sm:mt-3'>- Mandarin CSR</p>
                            </div>
                        </div>

                        {/* Feedback 2 */}
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <img 
                                src={CandidateFeedBack2} 
                                alt="Candidate Feedback" 
                                className='w-full h-40 sm:h-48 md:h-52 object-cover'
                            />
                            <div className='p-3 sm:p-4'>
                                <div className='flex items-center gap-0.5 sm:gap-1 text-orange-400 mb-1 sm:mb-2 text-xs sm:text-sm'>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                                <p className='text-orange-700 text-xs sm:text-sm italic line-clamp-3'>
                                    "As a Mandarin speaker, I was looking for opportunities where my language skills would be valued. N&M Staffing connected me with a great BPO company."
                                </p>
                                <p className='text-xs text-orange-500 mt-2 sm:mt-3'>- Portuguese CSR</p>
                            </div>
                        </div>

                        {/* Feedback 3 */}
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <img 
                                src={CandidateFeedBack3} 
                                alt="Candidate Feedback" 
                                className='w-full h-40 sm:h-48 md:h-52 object-cover'
                            />
                            <div className='p-3 sm:p-4'>
                                <div className='flex items-center gap-0.5 sm:gap-1 text-orange-400 mb-1 sm:mb-2 text-xs sm:text-sm'>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                                <p className='text-orange-700 text-xs sm:text-sm italic line-clamp-3'>
                                    "The team at N&M Staffing took time to understand my career goals and language proficiency. They found me a role that perfectly matches my skills."
                                </p>
                                <p className='text-xs text-orange-500 mt-2 sm:mt-3'>- Japanese SAP Consultant</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - Responsive */}
            <div className='bg-orange-800 text-white py-12 sm:py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8'>
                        <div className='text-center'>
                            <div className='text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2'>200+</div>
                            <p className='text-orange-200 text-xs sm:text-sm'>Successful Placements</p>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2'>30+</div>
                            <p className='text-orange-200 text-xs sm:text-sm'>Partner Companies</p>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2'>8</div>
                            <p className='text-orange-200 text-xs sm:text-sm'>Languages</p>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl sm:text-3xl md:text-4xl font-light mb-1 sm:mb-2'>95%</div>
                            <p className='text-orange-200 text-xs sm:text-sm'>Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial - Responsive */}
            <div className='max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16'>
                <div className='bg-white p-6 sm:p-8 rounded-xl shadow-md relative border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300'>
                    <FontAwesomeIcon icon={faQuoteRight} className='absolute top-4 right-4 sm:top-6 sm:right-6 text-orange-100 text-3xl sm:text-4xl' />
                    <p className='text-orange-700 italic text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed'>
                        "N&M Staffing understood exactly what we were looking for. They found us a Japanese-speaking 
                        team lead who not only had the language skills but also understood our company culture. 
                        The placement has been transformative for our BPO operations."
                    </p>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-200 rounded-full'></div>
                        <div>
                            <p className='font-medium text-orange-800 text-sm sm:text-base'>Maria Santos</p>
                            <p className='text-xs sm:text-sm text-orange-500'>HR Director, Global BPO Solutions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutNM;