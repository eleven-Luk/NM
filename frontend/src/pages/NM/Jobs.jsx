import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcase,
    faSearch,
    faFilter,
    faTimes,
    faMapMarkerAlt,
    faClock,
    faMoneyBillWave,
    faLanguage,
    faBuilding,
    faCalendarAlt,
    faBookmark,
    faShare,
    faInfoCircle,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import bgImg from '../../assets/NM.png'

function Jobs() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('all');
    const [bookmarked, setBookmarked] = useState([]);

    // Job listings for N&M Staffing
    const jobs = [
        {
            id: 1,
            title: "Japanese Bilingual CSR",
            company: "IT Service Provider",
            location: "Makati City",
            type: "Full-time",
            schedule: "Day shift",
            salary: "₱45k - ₱60k",
            language: "Japanese (N2/N1)",
            posted: "2 days ago",
            description: "We are looking for a Japanese bilingual Customer Service Representative to handle inquiries from Japanese clients. Must have JLPT N2 or N1 certification.",
            requirements: [
                "JLPT N2 or N1 certified",
                "At least 1 year CSR experience",
                "Excellent communication skills",
                "Willing to work in Makati"
            ],
            benefits: [
                "HMO on day 1",
                "13th month pay",
                "Performance bonus",
                "Transportation allowance"
            ],
            featured: true
        },
        {
            id: 2,
            title: "Mandarin Speaker - Team Lead",
            company: "BPO Company",
            location: "BGC, Taguig",
            type: "Full-time",
            schedule: "Night shift",
            salary: "₱70k - ₱90k",
            language: "Mandarin & English",
            posted: "Just posted",
            description: "Leading a team of Mandarin-speaking agents. Responsible for team performance, coaching, and client communication.",
            requirements: [
                "Fluent in Mandarin and English",
                "2+ years Team Lead experience",
                "Strong leadership skills",
                "College graduate preferred"
            ],
            benefits: [
                "Competitive salary package",
                "Night differential",
                "Health insurance",
                "Annual leave"
            ],
            featured: true
        },
        {
            id: 3,
            title: "Korean Bilingual Recruiter",
            company: "Global HR Firm",
            location: "Pasay City",
            type: "Hybrid",
            schedule: "Day shift",
            salary: "₱50k - ₱65k",
            language: "Korean (TOPIK 5+)",
            posted: "1 week ago",
            description: "Recruit Korean-speaking professionals for various industries. End-to-end recruitment process.",
            requirements: [
                "TOPIK Level 5 or higher",
                "Recruitment experience preferred",
                "Strong interpersonal skills",
                "Can work hybrid setup"
            ],
            benefits: [
                "Hybrid work arrangement",
                "Performance incentives",
                "Career growth opportunities",
                "Government benefits"
            ],
            featured: false
        },
        {
            id: 4,
            title: "Spanish Voice Agent",
            company: "Telecom Company",
            location: "Clark, Pampanga",
            type: "Full-time",
            schedule: "Night shift",
            salary: "₱40k - ₱55k",
            language: "Spanish (Fluent)",
            posted: "3 days ago",
            description: "Handle inbound calls from Spanish-speaking customers. Provide excellent customer service and support.",
            requirements: [
                "Fluent in Spanish (oral and written)",
                "Good English communication",
                "Customer service experience",
                "Willing to work in Clark"
            ],
            benefits: [
                "Free shuttle service",
                "Meal allowance",
                "Night differential",
                "Performance bonus"
            ],
            featured: true
        },
        {
            id: 5,
            title: "French Translator",
            company: "International NGO",
            location: "Remote (PH)",
            type: "Project-based",
            schedule: "Flexible",
            salary: "₱35k - ₱50k",
            language: "French & English",
            posted: "5 days ago",
            description: "Translate documents from French to English and vice versa. Work remotely on various projects.",
            requirements: [
                "Native or fluent French",
                "Translation experience",
                "Attention to detail",
                "Can work independently"
            ],
            benefits: [
                "Remote work",
                "Flexible hours",
                "Project-based pay",
                "International exposure"
            ],
            featured: false
        },
        {
            id: 6,
            title: "Cantonese Support Specialist",
            company: "Financial Services",
            location: "Ortigas, Pasig",
            type: "Full-time",
            schedule: "Day shift",
            salary: "₱55k - ₱75k",
            language: "Cantonese",
            posted: "Just posted",
            description: "Provide customer support to Cantonese-speaking clients in the financial sector.",
            requirements: [
                "Fluent in Cantonese",
                "Financial background is a plus",
                "College graduate",
                "Good problem-solving skills"
            ],
            benefits: [
                "Sign-on bonus",
                "HMO with dependents",
                "Annual performance review",
                "Career advancement"
            ],
            featured: true
        },
        {
            id: 7,
            title: "Vietnamese Interpreter",
            company: "Medical BPO",
            location: "Quezon City",
            type: "Full-time",
            schedule: "Shifting",
            salary: "₱45k - ₱58k",
            language: "Vietnamese & English",
            posted: "1 week ago",
            description: "Provide interpretation services for medical consultations between Vietnamese patients and healthcare providers.",
            requirements: [
                "Fluent in Vietnamese and English",
                "Medical background preferred",
                "Interpretation experience",
                "Empathetic and professional"
            ],
            benefits: [
                "Health insurance",
                "Paid training",
                "Allowances",
                "Retirement plan"
            ],
            featured: false
        },
        {
            id: 8,
            title: "German Content Moderator",
            company: "Social Media Platform",
            location: "Remote (PH)",
            type: "Full-time",
            schedule: "Shifting",
            salary: "₱60k - ₱80k",
            language: "German (C1)",
            posted: "2 weeks ago",
            description: "Review and moderate content for a global social media platform. Must be fluent in German.",
            requirements: [
                "German C1 level or higher",
                "Tech-savvy",
                "Attention to detail",
                "Can work remotely"
            ],
            benefits: [
                "Work from home",
                "Equipment provided",
                "Internet allowance",
                "Global team experience"
            ],
            featured: true
        }
    ];

    const categories = [
        { id: 'all', name: 'All Jobs', count: jobs.length },
        { id: 'full-time', name: 'Full Time', count: jobs.filter(j => j.type === 'Full-time').length },
        { id: 'hybrid', name: 'Hybrid', count: jobs.filter(j => j.type === 'Hybrid').length },
        { id: 'project-based', name: 'Project Based', count: jobs.filter(j => j.type === 'Project-based').length },
        { id: 'remote', name: 'Remote', count: jobs.filter(j => j.location.includes('Remote')).length }
    ];

    const languages = [
        { id: 'all', name: 'All Languages' },
        { id: 'japanese', name: 'Japanese' },
        { id: 'mandarin', name: 'Mandarin' },
        { id: 'korean', name: 'Korean' },
        { id: 'spanish', name: 'Spanish' },
        { id: 'french', name: 'French' },
        { id: 'cantonese', name: 'Cantonese' },
        { id: 'vietnamese', name: 'Vietnamese' },
        { id: 'german', name: 'German' }
    ];

    // Filter jobs based on category, search, and language
    const filteredJobs = jobs.filter(job => {
        const matchesCategory = selectedCategory === 'all' || 
            (selectedCategory === 'remote' && job.location.includes('Remote')) ||
            job.type.toLowerCase() === selectedCategory;

        const matchesLanguage = selectedLanguage === 'all' || 
            job.language.toLowerCase().includes(selectedLanguage.toLowerCase());

        
        const matchesSearch = searchTerm === '' ||
                            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.language.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch && matchesLanguage;
    });



    const featuredJobs = jobs.filter(j => j.featured).slice(0, 3);

    return (
        <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white'>
            {/* Header Section */}
            <div className='bg-gradient-to-b from-orange-50 to-orange-100 border-b border-orange-200'>
                <div className='max-w-7xl mx-auto px-6 py-12'>
                    <div className='flex items-center gap-3 mb-4'>
                        <img 
                            src={bgImg} 
                            alt="N&M Staffing Logo"   
                            className='w-20 h-20 rounded-xl shadow-md border-2 border-orange-300 object-cover'
                        />
                        <div className='w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-600 text-xl' />
                        </div>
                        <h1 className='text-3xl font-light text-orange-800'>Job Opportunities</h1>
                    </div>
                    <div className='w-20 h-0.5 bg-orange-400 mb-6'></div>
                    
                    <div className='bg-white p-6 rounded-xl shadow-sm border border-orange-100 max-w-4xl'>
                        <p className='text-orange-500 text-xs uppercase tracking-widest mb-3 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-orange-400'></span>
                            BILINGUAL | MULTILINGUAL | PROFESSIONAL OPPORTUNITIES
                        </p>
                        <p className='text-orange-700 leading-relaxed'>
                            We connect bilingual and multilingual professionals with premier career opportunities across the Philippines. 
                            Browse through our current job openings and find your next career move.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            {featuredJobs.length > 0 && (
                <div className='max-w-7xl mx-auto px-4 py-12'>
                    <h2 className='text-2xl font-light text-orange-800 mb-6'>Featured Opportunities</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {featuredJobs.map(job => (
                            <div 
                                key={job.id}
                                className='relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white border border-orange-100 hover:shadow-xl transition-all'
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className='p-6'>
                                    <div className='flex items-start justify-between mb-4'>
                                        <div>
                                            <h3 className='font-medium text-orange-800 text-lg mb-1'>{job.title}</h3>
                                            <p className='text-sm text-gray-500'>{job.company}</p>
                                        </div>
                                        <span className='bg-orange-500 text-white text-xs px-2 py-1 rounded-full'>
                                            Featured
                                        </span>
                                    </div>
                                    
                                    <div className='space-y-2 mb-4'>
                                        <p className='text-xs text-gray-500 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-400' />
                                            {job.location}
                                        </p>
                                        <p className='text-xs text-gray-500 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faClock} className='text-orange-400' />
                                            {job.type} • {job.schedule}
                                        </p>
                                        <p className='text-xs text-gray-500 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faMoneyBillWave} className='text-orange-400' />
                                            {job.salary}
                                        </p>
                                        <p className='text-xs text-gray-500 flex items-center gap-2'>
                                            <FontAwesomeIcon icon={faLanguage} className='text-orange-400' />
                                            {job.language}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center justify-between text-xs'>
                                        <span className='text-orange-400'>{job.posted}</span>
                                        <span className='text-orange-600 font-medium'>View Details →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Jobs Section */}
            <div className='max-w-7xl mx-auto px-4 py-12'>
                {/* Search and Filter Bar */}
                <div className='flex flex-col md:flex-row gap-4 mb-8'>
                    <div className='flex-1 relative'>
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm'
                        />
                        <input
                            type='text'
                            placeholder='Search jobs by title, company, or language...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm'
                        />
                    </div>
                    <button
                        className='flex items-center gap-2 px-6 py-3 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-orange-600 text-sm'
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        Filter
                    </button>
                </div>

                {/* Category Filters */}
                <div className='flex flex-wrap gap-2 mb-4'>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                                selectedCategory === category.id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-orange-600 hover:bg-orange-100 border border-orange-200'
                            }`}
                        >
                            {category.name} ({category.count})
                        </button>
                    ))}
                </div>

                {/* Language Quick Filters */}
                <div className='flex flex-wrap gap-2 mb-8'>
                    <span className='text-xs text-gray-400 py-2'>Languages:</span>
                    {languages.map(language => (
                        <button
                            key={language.id}
                            onClick={() => setSelectedLanguage(language.id)}
                            className={`px-2 py-1 rounded-full text-xs transition-all ${
                                selectedLanguage === language.id
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-orange-600 hover:bg-orange-100 border border-orange-200'
                            }`}
                        >
                            {language.name}
                        </button>
                    ))}
                </div>

                {/* Jobs Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredJobs.map(job => (
                        <div 
                            key={job.id}
                            className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-orange-100'
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className='p-5'>
                                <div className='flex items-start justify-between mb-3'>
                                    <div>
                                        <h3 className='font-medium text-orange-800 mb-1'>{job.title}</h3>
                                        <p className='text-xs text-gray-500 flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faBuilding} className='text-orange-400' />
                                            {job.company}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className='space-y-2 mb-4 text-xs'>
                                    <p className='flex items-center gap-2 text-gray-600'>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-400 w-3' />
                                        {job.location}
                                    </p>
                                    <p className='flex items-center gap-2 text-gray-600'>
                                        <FontAwesomeIcon icon={faClock} className='text-orange-400 w-3' />
                                        {job.type} • {job.schedule}
                                    </p>
                                    <p className='flex items-center gap-2 text-gray-600'>
                                        <FontAwesomeIcon icon={faMoneyBillWave} className='text-orange-400 w-3' />
                                        {job.salary}
                                    </p>
                                    <p className='flex items-center gap-2 text-gray-600'>
                                        <FontAwesomeIcon icon={faLanguage} className='text-orange-400 w-3' />
                                        {job.language}
                                    </p>
                                </div>
                                
                                <div className='flex items-center justify-between pt-3 border-t border-orange-100'>
                                    <span className='text-xs text-orange-400'>{job.posted}</span>
                                    <span className='text-xs text-orange-600 font-medium group-hover:underline'>
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredJobs.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <FontAwesomeIcon icon={faBriefcase} className='text-orange-400 text-2xl' />
                        </div>
                        <h3 className='text-lg font-medium text-orange-800 mb-2'>No jobs found</h3>
                        <p className='text-orange-500'>Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Load More Button */}
                {filteredJobs.length > 0 && (
                    <div className='text-center mt-12'>
                        <button className='px-8 py-3 bg-white border border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm'>
                            Load More Jobs
                        </button>
                    </div>
                )}
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div 
                    className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'
                    onClick={() => setSelectedJob(null)}
                >
                    <button
                        onClick={() => setSelectedJob(null)}
                        className='absolute top-4 right-4 text-white hover:text-orange-300 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faTimes} className='text-xl' />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredJobs.findIndex(j => j.id === selectedJob.id);
                            if (currentIndex > 0) {
                                setSelectedJob(filteredJobs[currentIndex - 1]);
                            }
                        }}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-300 disabled:opacity-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredJobs.findIndex(j => j.id === selectedJob.id) === 0}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredJobs.findIndex(j => j.id === selectedJob.id);
                            if (currentIndex < filteredJobs.length - 1) {
                                setSelectedJob(filteredJobs[currentIndex + 1]);
                            }
                        }}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-300 disabled:opacity-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredJobs.findIndex(j => j.id === selectedJob.id) === filteredJobs.length - 1}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>

                    <div 
                        className='relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Job Header */}
                        <div className='bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white'>
                            <div className='flex items-start justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold mb-2'>{selectedJob.title}</h2>
                                    <p className='text-orange-100'>{selectedJob.company}</p>
                                </div>
                                {selectedJob.featured && (
                                    <span className='bg-white text-orange-600 text-xs px-3 py-1 rounded-full'>
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className='p-6'>
                            {/* Quick Info Grid */}
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Location</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.location}</p>
                                </div>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Job Type</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.type}</p>
                                </div>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Schedule</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.schedule}</p>
                                </div>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Salary</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.salary}</p>
                                </div>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Language</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.language}</p>
                                </div>
                                <div className='bg-orange-50 p-3 rounded-lg'>
                                    <p className='text-xs text-orange-400 mb-1'>Posted</p>
                                    <p className='text-sm font-medium text-orange-800'>{selectedJob.posted}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className='mb-6'>
                                <h3 className='text-lg font-medium text-orange-800 mb-3'>Job Description</h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                    {selectedJob.description}
                                </p>
                            </div>

                            {/* Requirements */}
                            <div className='mb-6'>
                                <h3 className='text-lg font-medium text-orange-800 mb-3'>Requirements</h3>
                                <ul className='list-disc pl-5 space-y-1'>
                                    {selectedJob.requirements.map((req, index) => (
                                        <li key={index} className='text-sm text-gray-600'>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div className='mb-6'>
                                <h3 className='text-lg font-medium text-orange-800 mb-3'>Benefits</h3>
                                <ul className='list-disc pl-5 space-y-1'>
                                    {selectedJob.benefits.map((benefit, index) => (
                                        <li key={index} className='text-sm text-gray-600'>{benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center gap-3 pt-4 border-t border-orange-100'>
                                <button className='flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors'>
                                    Apply Now
                                </button>
                                <button 
                                    onClick={() => toggleBookmark(selectedJob.id)}
                                    className='w-12 h-12 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors'
                                >
                                    <FontAwesomeIcon 
                                        icon={faBookmark} 
                                        className={bookmarked.includes(selectedJob.id) ? 'text-orange-600' : 'text-orange-400'} 
                                    />
                                </button>
                                <button className='w-12 h-12 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faShare} className='text-orange-400' />
                                </button>
                                <button className='w-12 h-12 bg-orange-100 hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors'>
                                    <FontAwesomeIcon icon={faInfoCircle} className='text-orange-400' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Jobs;