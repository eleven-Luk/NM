import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronLeft, 
    faChevronRight, 
    faCircle,
    faBriefcase,
    faLocationDot,
    faClock,
    faArrowRight,
    faCalendarCheck,
    faTag,
    faBuilding,
    faLanguage,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import MContactModal from '../components/modals/MContactModal';
import NMContactModal from '../components/modals/NMContactModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Sample images
import S1 from '../assets/MapleSample1.jpg';
import S2 from '../assets/MSample2.jpg';
import S3 from '../assets/MSample3.jpg';
import S4 from '../assets/MSample4.jpg';
import S5 from '../assets/Msample5jpg.jpg';
import S6 from '../assets/MSample6.jpg';

function Body() {
    const slides = [
        { id: 1, image: S1, title: "Newborn Wonder", description: "Tiny fingers, tiny toes – preserving the first precious days" },
        { id: 2, image: S2, title: "Maternity Glow", description: "Celebrating the beauty of new life and motherhood" },
        { id: 3, image: S3, title: "Family Love", description: "Genuine connections and laughter shared together" },
        { id: 4, image: S4, title: "Toddler Magic", description: "Curious eyes and playful spirits, frozen in time" },
        { id: 5, image: S5, title: "Milestone Moments", description: "First steps, first smiles, first memories" },
        { id: 6, image: S6, title: "Pure Emotion", description: "Unposed, unfiltered, unforgettable" }
    ];

    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredSlide, setHoveredSlide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/jobs/all');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const result = await response.json();
                if (result.success) {
                    const sortedJobs = (result.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setJobs(sortedJobs);
                } else {
                    throw new Error(result.message || 'Failed to fetch jobs');
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError(error.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length, hoveredSlide]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const formatPostedDate = (dateString) => {
        if (!dateString) return 'Recently';
        const now = new Date();
        const posted = new Date(dateString);
        const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return posted.toLocaleDateString();
    };

    const handleApplyClick = (job) => {
        const isValidId = /^[0-9a-fA-F]{24}$/.test(job._id);
        if (!job._id || !isValidId) {
            console.error('Invalid job ID:', job._id);
            alert('Invalid job selection. Please try again.');
            return;
        }
        setSelectedJob(job);
        setIsJobModalOpen(true);
    };

    const formatJobType = (type) => {
        const typeMap = {
            'fulltime': 'Full-time', 'parttime': 'Part-time', 'contract': 'Contract',
            'internship': 'Internship', 'Full-Time': 'Full-time', 'Part-Time': 'Part-time',
            'Contract': 'Contract', 'Internship': 'Internship'
        };
        return typeMap[type] || type || 'Full-time';
    };

    return (
        <div className='flex flex-col lg:flex-row w-full min-h-screen'>
            {/* Maple Street Photography - Left Side */}
            <div className='w-full lg:w-1/2 bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-200'>
                <div className='mb-6 sm:mb-8 md:mb-10'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                            <span className='text-gray-600 text-base sm:text-xl'>📸</span>
                        </div>
                        <h2 className='text-xl sm:text-2xl font-light text-gray-800'>About Maple Street Photography</h2>
                    </div>
                    <div className='w-12 sm:w-16 h-0.5 bg-gray-400 mb-4 sm:mb-5'></div>
                    
                    <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                        <p className='text-gray-500 text-xs uppercase tracking-widest mb-3 sm:mb-4 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-gray-400'></span>
                            MINIMALIST | TIMELESS | PREMIUM SERVICE
                        </p>
                        <p className='text-gray-600 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4'>
                            We believe that life's most beautiful stories are written in the quiet, candid moments. 
                            Specializing in newborn, maternity, and family milestones, we offer more than just photos 
                            —we offer an experience.
                        </p>
                        <p className='text-gray-600 leading-relaxed text-xs sm:text-sm'>
                            With a focus on natural light and genuine emotion, our approach is minimalist and timeless, 
                            ensuring your memories never go out of style.
                        </p>
                    </div>
                </div>

                {/* Slideshow */}
                <div className='relative rounded-xl overflow-hidden shadow-lg bg-white'
                     onMouseEnter={() => setHoveredSlide(true)}
                     onMouseLeave={() => setHoveredSlide(false)}>
                    <div className='relative h-64 sm:h-80 md:h-96'>
                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title}
                            className='w-full h-full object-cover transition-transform duration-700 hover:scale-105' />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'></div>
                        <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white'>
                            <h3 className='text-lg sm:text-xl md:text-2xl font-medium mb-1'>{slides[currentSlide].title}</h3>
                            <p className='text-white/80 text-xs sm:text-sm mb-3 sm:mb-4'>{slides[currentSlide].description}</p>
                            <button onClick={() => setIsModalOpen(true)}
                                className='bg-white text-gray-800 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm 
                                         hover:bg-gray-300 transition-all duration-300 flex items-center gap-2 shadow-lg'>
                                <FontAwesomeIcon icon={faCalendarCheck} className='text-gray-600' />
                                Book Appointment
                            </button>
                        </div>
                        <button onClick={prevSlide}
                            className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 
                                     backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white'>
                            <FontAwesomeIcon icon={faChevronLeft} className='text-xs sm:text-sm' />
                        </button>
                        <button onClick={nextSlide}
                            className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 
                                     backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white'>
                            <FontAwesomeIcon icon={faChevronRight} className='text-xs sm:text-sm' />
                        </button>
                    </div>
                    <div className='flex justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-white'>
                        {slides.map((_, index) => (
                            <button key={index} onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 ${index === currentSlide ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-gray-600 rounded-full' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 hover:bg-gray-400 rounded-full'}`}>
                                <span className='sr-only'>Slide {index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className='mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3'>
                    <div className='bg-white p-2 sm:p-3 rounded-lg shadow-sm text-center'>
                        <div className='text-base sm:text-xl font-light text-gray-700'>5+</div>
                        <div className='text-xs text-gray-500'>Years</div>
                    </div>
                    <div className='bg-white p-2 sm:p-3 rounded-lg shadow-sm text-center'>
                        <div className='text-base sm:text-xl font-light text-gray-700'>200+</div>
                        <div className='text-xs text-gray-500'>Clients</div>
                    </div>
                    <div className='bg-white p-2 sm:p-3 rounded-lg shadow-sm text-center'>
                        <div className='text-base sm:text-xl font-light text-gray-700'>6</div>
                        <div className='text-xs text-gray-500'>Packages</div>
                    </div>
                </div>
            </div>

            {/* N&M Staffing Services - Right Side */}
            <div className='w-full lg:w-1/2 bg-gradient-to-b from-orange-50 to-orange-100 p-4 sm:p-6 md:p-8'>
                <div className='mb-6 sm:mb-8 md:mb-10'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-orange-200 rounded-full flex items-center justify-center'>
                            <span className='text-orange-600 text-base sm:text-xl'>💼</span>
                        </div>
                        <h2 className='text-xl sm:text-2xl font-light text-orange-800'>About N&M Staffing Services</h2>
                    </div>
                    <div className='w-12 sm:w-16 h-0.5 bg-orange-400 mb-4 sm:mb-5'></div>
                    
                    <div className='bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow'>
                        <p className='text-orange-500 text-xs uppercase tracking-widest mb-3 sm:mb-4 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-orange-400'></span>
                            BILINGUAL TALENT | PROFESSIONAL OPPORTUNITIES | PHILIPPINES
                        </p>
                        <p className='text-orange-700 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4'>
                            We connect bilingual and multilingual professionals with premier career opportunities across the Philippines. 
                            Whether you speak English, Mandarin, Japanese, Korean, or other languages, we help bridge the gap between 
                            your skills and companies seeking diverse perspectives.
                        </p>
                        <p className='text-orange-700 leading-relaxed text-xs sm:text-sm'>
                            Your ability to communicate across cultures isn't just a skill—it's your advantage, and we're here to help you 
                            find the perfect role where it truly matters.
                        </p>
                    </div>
                </div>

                {/* Job Listings */}
                <div className='bg-white rounded-xl shadow-lg p-4 sm:p-5'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5'>
                        <h3 className='text-base sm:text-lg font-medium text-orange-800 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-500' />
                            Latest Job Openings
                        </h3>
                        <span className='text-xs bg-orange-100 text-orange-600 px-2 sm:px-3 py-1 rounded-full self-start sm:self-center'>
                            {jobs.length} active jobs
                        </span>
                    </div>

                    {loading ? (
                        <LoadingSpinner message='Loading jobs...' />
                    ) : error ? (
                        <div className="bg-white border border-orange-200 p-6 sm:p-8 text-center">
                            <p className="text-4xl sm:text-6xl text-orange-200 mb-4">—</p>
                            <p className="text-gray-500 font-light mb-4 text-sm sm:text-base">Error: {error}</p>
                            <button onClick={() => window.location.reload()} className="px-4 sm:px-6 py-2 border border-orange-300 text-gray-600 text-xs sm:text-sm font-light tracking-wider hover:border-orange-900 hover:text-orange-900 transition-all">
                                Refresh
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className='text-center py-6 sm:py-8'>
                            <p className='text-gray-500 text-xs sm:text-sm'>No jobs available at the moment</p>
                        </div>
                    ) : (
                        <div className='space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar'>
                            {jobs.filter(job => job.status !== 'closed' && job.status !== 'archived').slice(0, 6).map((job) => {
                                const getStatusBadge = (status) => {
                                    const statusConfig = {
                                        active: { color: 'bg-green-100 text-green-800', label: 'Active' },
                                        inactive: { color: 'bg-yellow-100 text-yellow-800', label: 'Inactive' },
                                        closed: { color: 'bg-red-100 text-red-800', label: 'Closed' },
                                        archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
                                    };
                                    return statusConfig[status?.toLowerCase()] || statusConfig.active;
                                };
                                const statusConfig = getStatusBadge(job.status);
                                return (
                                    <div key={job._id} className='border border-orange-100 rounded-xl p-3 sm:p-4 transition-all hover:shadow-md bg-white'>
                                        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2'>
                                            <h4 className='font-medium text-orange-800 text-sm sm:text-base'>{job.name}</h4>
                                            <div className="flex gap-1.5 sm:gap-2">
                                                <span className='text-xs bg-orange-100 text-orange-600 px-2 py-0.5 sm:py-1 rounded-full'>{formatPostedDate(job.createdAt)}</span>
                                                <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-1.5 sm:gap-2 text-xs text-gray-500 mb-3'>
                                            <span className='flex items-center gap-1'><FontAwesomeIcon icon={faLocationDot} className='text-orange-400' />{job.location || 'Remote'}</span>
                                            <span className='flex items-center gap-1'><FontAwesomeIcon icon={faClock} className='text-orange-400' />{formatJobType(job.type)}</span>
                                            <span className='flex items-center gap-1 col-span-2'><FontAwesomeIcon icon={faTag} className='text-orange-400' />{job.salary || 'Salary negotiable'}</span>
                                        </div>
                                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                                            <span className='bg-blue-50 text-blue-600 text-xs px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 self-start'>
                                                <FontAwesomeIcon icon={faLanguage} className='text-xs' />
                                                {job.language || 'English'}
                                            </span>
                                            {job.status === 'active' ? (
                                                <button onClick={() => handleApplyClick(job)} className='text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm'>
                                                    Apply Now <FontAwesomeIcon icon={faArrowRight} className='text-xs' />
                                                </button>
                                            ) : (
                                                <span className='text-xs text-gray-400 bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-center'>Not Available</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className='mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-orange-100 grid grid-cols-3 gap-2 sm:gap-3'>
                        <div className='bg-orange-50 p-2 sm:p-3 rounded-lg text-center'>
                            <div className='text-base sm:text-xl font-light text-orange-700'>{jobs.length}+</div>
                            <div className='text-xs text-orange-500'>Active Jobs</div>
                        </div>
                        <div className='bg-orange-50 p-2 sm:p-3 rounded-lg text-center'>
                            <div className='text-base sm:text-xl font-light text-orange-700'>8</div>
                            <div className='text-xs text-orange-500'>Languages</div>
                        </div>
                        <div className='bg-orange-50 p-2 sm:p-3 rounded-lg text-center'>
                            <div className='text-base sm:text-xl font-light text-orange-700'>20+</div>
                            <div className='text-xs text-orange-500'>Partners</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #fff5e6; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f97316; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ea580c; }
            `}</style>

            <MContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <NMContactModal isOpen={isJobModalOpen} onClose={() => { setIsJobModalOpen(false); setSelectedJob(null); }} job={selectedJob} />
        </div>
    );
}

export default Body;