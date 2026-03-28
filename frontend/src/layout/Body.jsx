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
    faLanguage
} from '@fortawesome/free-solid-svg-icons';
import MContactModal from '../components/modals/MContactModal';
import NMContactModal from '../components/modals/NMContactModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Sample images for Maple Street slideshow
import S1 from '../assets/MapleSample1.jpg';
import S2 from '../assets/MSample2.jpg';
import S3 from '../assets/MSample3.jpg';
import S4 from '../assets/MSample4.jpg';
import S5 from '../assets/Msample5jpg.jpg';
import S6 from '../assets/MSample6.jpg';

function Body() {
    // Slideshow images for Maple Street Photography
    const slides = [
        {
            id: 1,
            image: S1,
            title: "Newborn Wonder",
            description: "Tiny fingers, tiny toes – preserving the first precious days",
        },
        {
            id: 2,
            image: S2,
            title: "Maternity Glow",
            description: "Celebrating the beauty of new life and motherhood",
        },
        {
            id: 3,
            image: S3,
            title: "Family Love",
            description: "Genuine connections and laughter shared together",
        },
        {
            id: 4,
            image: S4,
            title: "Toddler Magic",
            description: "Curious eyes and playful spirits, frozen in time",
        },
        {
            id: 5,
            image: S5,
            title: "Milestone Moments",
            description: "First steps, first smiles, first memories",
        },
        {
            id: 6,
            image: S6,
            title: "Pure Emotion",
            description: "Unposed, unfiltered, unforgettable",
        }
    ];

    // State for fetched jobs
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredSlide, setHoveredSlide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5000/api/jobs/all');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const result = await response.json();

                if (result.success) {
                    const sortedJobs = (result.data || []).sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
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

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length, hoveredSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Format date function
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

    // Handle apply button click - passes job to modal
    const handleApplyClick = (job) => {
        
        // Check if ID is valid (24 character hex string)
        const isValidId = /^[0-9a-fA-F]{24}$/.test(job._id);
        console.log('Is valid MongoDB ID?', isValidId);
        
        if (!job._id || !isValidId) {
            console.error('Invalid job ID:', job._id);
            alert('Invalid job selection. Please try again.');
            return;
        }
        
        setSelectedJob(job);
        setIsJobModalOpen(true);
    };

    // Format job type for display
    const formatJobType = (type) => {
        const typeMap = {
            'fulltime': 'Full-time',
            'parttime': 'Part-time',
            'contract': 'Contract',
            'internship': 'Internship',
            'Full-Time': 'Full-time',
            'Part-Time': 'Part-time',
            'Contract': 'Contract',
            'Internship': 'Internship'
        };
        return typeMap[type] || type || 'Full-time';
    };

    return (
        <div className='flex w-full min-h-screen'>
            {/* Maple Street Photography - Left Side */}
            <div className='w-1/2 bg-gradient-to-b from-gray-50 to-gray-100 p-8 border-r border-gray-200'>
                {/* Description Section */}
                <div className='mb-10'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                            <span className='text-gray-600 text-xl'>📸</span>
                        </div>
                        <h2 className='text-2xl font-light text-gray-800'>About Maple Street Photography</h2>
                    </div>
                    <div className='w-16 h-0.5 bg-gray-400 mb-5'></div>
                    
                    <div className='bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300'>
                        <p className='text-gray-500 text-xs uppercase tracking-widest mb-4 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-gray-400'></span>
                            MINIMALIST | TIMELESS | PREMIUM SERVICE
                        </p>
                        
                        <p className='text-gray-600 leading-relaxed text-sm mb-4'>
                            We believe that life's most beautiful stories are written in the quiet, candid moments. 
                            Specializing in newborn, maternity, and family milestones, we offer more than just photos 
                            —we offer an experience.
                        </p>
                        
                        <p className='text-gray-600 leading-relaxed text-sm'>
                            With a focus on natural light and genuine emotion, our approach is minimalist and timeless, 
                            ensuring your memories never go out of style.
                        </p>
                    </div>
                </div>

                {/* Slideshow Section */}
                <div className='relative rounded-xl overflow-hidden shadow-lg bg-white'
                     onMouseEnter={() => setHoveredSlide(true)}
                     onMouseLeave={() => setHoveredSlide(false)}>
                    
                    <div className='relative h-96'>
                        <img 
                            src={slides[currentSlide].image} 
                            alt={slides[currentSlide].title}
                            className='w-full h-full object-cover transition-transform duration-700 hover:scale-105' 
                        />
                        
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'></div>
                        
                        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                            <h3 className='text-2xl font-medium mb-1'>{slides[currentSlide].title}</h3>
                            <p className='text-white/80 text-sm mb-4'>{slides[currentSlide].description}</p>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className='bg-white text-gray-800 px-6 py-2.5 rounded-lg font-medium text-sm 
                                         hover:bg-gray-300 transition-all duration-300 flex items-center gap-2 
                                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            >
                                <FontAwesomeIcon icon={faCalendarCheck} className='text-gray-600' />
                                Book Appointment
                            </button>
                        </div>

                        <button 
                            onClick={prevSlide}
                            className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 
                                     backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center 
                                     text-white transition-all duration-200 border border-white/20'
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className='text-sm' />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 
                                     backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center 
                                     text-white transition-all duration-200 border border-white/20'
                        >
                            <FontAwesomeIcon icon={faChevronRight} className='text-sm' />
                        </button>
                    </div>

                    <div className='flex justify-center gap-2 py-4 bg-white'>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'w-6 h-2 bg-gray-600 rounded-full' 
                                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                                }`}
                            >
                                <span className='sr-only'>Slide {index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className='mt-6 grid grid-cols-3 gap-3'>
                    <div className='bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300'>
                        <div className='text-xl font-light text-gray-700'>5+</div>
                        <div className='text-xs text-gray-500'>Years</div>
                    </div>
                    <div className='bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300'>
                        <div className='text-xl font-light text-gray-700'>200+</div>
                        <div className='text-xs text-gray-500'>Clients</div>
                    </div>
                    <div className='bg-white p-3 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300'>
                        <div className='text-xl font-light text-gray-700'>6</div>
                        <div className='text-xs text-gray-500'>Packages</div>
                    </div>
                </div>
            </div>

            {/* N&M Staffing Services - Right Side */}
            <div className='w-1/2 bg-gradient-to-b from-orange-50 to-orange-100 p-8'>
                {/* Description Section */}
                <div className='mb-10'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div className='w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center'>
                            <span className='text-orange-600 text-xl'>💼</span>
                        </div>
                        <h2 className='text-2xl font-light text-orange-800'>About N&M Staffing Services</h2>
                    </div>
                    <div className='w-16 h-0.5 bg-orange-400 mb-5'></div>
                    
                    <div className='bg-white p-5 rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-300'>
                        <p className='text-orange-500 text-xs uppercase tracking-widest mb-4 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-orange-400'></span>
                            BILINGUAL TALENT | PROFESSIONAL OPPORTUNITIES | PHILIPPINES
                        </p>
                        
                        <p className='text-orange-700 leading-relaxed text-sm mb-4'>
                            We connect bilingual and multilingual professionals with premier career opportunities across the Philippines. 
                            Whether you speak English, Mandarin, Japanese, Korean, or other languages, we help bridge the gap between 
                            your skills and companies seeking diverse perspectives.
                        </p>
                        
                        <p className='text-orange-700 leading-relaxed text-sm'>
                            Your ability to communicate across cultures isn't just a skill—it's your advantage, and we're here to help you 
                            find the perfect role where it truly matters.
                        </p>
                    </div>
                </div>

                {/* Job Listings Section */}
                <div className='bg-white rounded-xl shadow-lg p-5'>
                    <div className='flex items-center justify-between mb-5'>
                        <h3 className='text-lg font-medium text-orange-800 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-500' />
                            Latest Job Openings
                        </h3>
                        <span className='text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full'>
                            {jobs.length} active jobs
                        </span>
                    </div>

                    {loading ? (
                        <LoadingSpinner message='Loading jobs...' />
                    ) : error ? (
                        <div className="bg-white border border-orange-200 p-8 text-center">
                            <p className="text-6xl text-orange-200 mb-4">—</p>
                            <p className="text-gray-500 font-light mb-4">Error: {error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 border border-orange-300 text-gray-600 text-sm font-light tracking-wider hover:border-orange-900 hover:text-orange-900 hover:bg-stone-50 transition-all duration-300"
                            >
                                Refresh
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className='text-center py-8'>
                            <p className='text-gray-500 text-sm'>No jobs available at the moment</p>
                        </div>
                    ) : (
                        <div className='space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar'>
                            {jobs.slice(0, 6).map((job) => (
                                <div 
                                    key={job._id} 
                                    className='border border-orange-100 rounded-xl p-4 transition-all duration-300 hover:shadow-md bg-white'
                                >
                                    <div className='flex justify-between items-start mb-2'>
                                        <h4 className='font-medium text-orange-800 text-base'>{job.name}</h4>
                                        <span className='text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full whitespace-nowrap'>
                                            {formatPostedDate(job.createdAt)}
                                        </span>
                                    </div>
                                    
                                    <div className='grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3'>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faLocationDot} className='text-orange-400' />
                                            {job.location || 'Remote'}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faClock} className='text-orange-400' />
                                            {formatJobType(job.type)}
                                        </span>
                                        <span className='flex items-center gap-1 col-span-2'>
                                            <FontAwesomeIcon icon={faTag} className='text-orange-400' />
                                            {job.salary || 'Salary negotiable'}
                                        </span>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <span className='bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faLanguage} className='text-xs' />
                                            {job.language || 'English'}
                                        </span>

                                        {/* ✅ FIXED: Pass the job to handleApplyClick */}
                                        <button 
                                            onClick={() => handleApplyClick(job)}
                                            className='text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 
                                                     rounded-lg flex items-center gap-2 transition-all duration-200 
                                                     shadow-sm hover:shadow'
                                        >
                                            Apply Now 
                                            <FontAwesomeIcon icon={faArrowRight} className='text-xs' />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className='mt-6 pt-5 border-t border-orange-100 grid grid-cols-3 gap-3'>
                        <div className='bg-orange-50 p-3 rounded-lg text-center hover:shadow-md transition-shadow duration-300'>
                            <div className='text-xl font-light text-orange-700'>{jobs.length}+</div>
                            <div className='text-xs text-orange-500'>Active Jobs</div>
                        </div>
                        <div className='bg-orange-50 p-3 rounded-lg text-center hover:shadow-md transition-shadow duration-300'>
                            <div className='text-xl font-light text-orange-700'>8</div>
                            <div className='text-xs text-orange-500'>Languages</div>
                        </div>
                        <div className='bg-orange-50 p-3 rounded-lg text-center hover:shadow-md transition-shadow duration-300'>
                            <div className='text-xl font-light text-orange-700'>20+</div>
                            <div className='text-xs text-orange-500'>Partners</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #fff5e6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f97316;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ea580c;
                }
            `}</style>

            {/* Modals */}
            <MContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <NMContactModal
                isOpen={isJobModalOpen}
                onClose={() => {
                    setIsJobModalOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
            />
        </div>
    );
}

export default Body;