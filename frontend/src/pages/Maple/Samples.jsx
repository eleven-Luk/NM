import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faHeart,
    faShare,
    faSearch,
    faFilter,
    faTimes,
    faChevronLeft,
    faChevronRight,
    faInfoCircle,
    faCalendarAlt,
    faMapMarkerAlt,
    faTag,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

// Import your sample images (same as in Body)
import S1 from '../../assets/MapleSample1.jpg';
import S2 from '../../assets/MSample2.jpg';
import S3 from '../../assets/MSample3.jpg';
import S4 from '../../assets/MSample4.jpg';
import S5 from '../../assets/Msample5jpg.jpg';
import S6 from '../../assets/MSample6.jpg';

import bgImg from '../../assets/NielLogo.jpg'

function Samples() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    

    // Complete sample collection
    const samples = [
        // Newborn Category
        {
            id: 1,
            title: "Newborn Wonder",
            category: "newborn",
            subCategory: "Newborn",
            image: S1,
            description: "Tiny fingers, tiny toes – preserving the first precious days",
            date: "March 2026",
            location: "Studio",
            featured: true
        },
        {
            id: 2,
            title: "Peaceful Dreams",
            category: "newborn",
            subCategory: "Newborn",
            image: S5,
            description: "Sweet serenity in the earliest days of life",
            date: "February 2026",
            location: "Studio",
            featured: false
        },
        // Maternity Category
        {
            id: 3,
            title: "Maternity Glow",
            category: "maternity",
            subCategory: "Maternity",
            image: S2,
            description: "Celebrating the beauty of new life and motherhood",
            date: "March 2026",
            location: "Studio",
            featured: true
        },
        {
            id: 5,
            title: "Family Love",
            category: "family",
            subCategory: "Family",
            image: S3,
            description: "Genuine connections and laughter shared together",
            date: "February 2026",
            location: "BGC",
            featured: true
        },

        {
            id: 7,
            title: "Toddler Magic",
            category: "toddler",
            subCategory: "Toddler",
            image: S4,
            description: "Curious eyes and playful spirits, frozen in time",
            date: "March 2026",
            location: "Outdoor",
            featured: true
        },
        {
            id: 9,
            title: "Milestone Moments",
            category: "milestone",
            subCategory: "Milestone",
            image: S5,
            description: "First steps, first smiles, first memories",
            date: "February 2026",
            location: "Studio",
            featured: false
        },
        {
            id: 10,
            title: "Pure Emotion",
            category: "milestone",
            subCategory: "Milestone",
            image: S6,
            description: "Unposed, unfiltered, unforgettable",
            date: "March 2026",
            location: "Studio",
            featured: true
        },
    ];

    const categories = [
        { id: 'all', name: 'All Samples', count: samples.length },
        { id: 'newborn', name: 'Newborn', count: samples.filter(s => s.category === 'newborn').length },
        { id: 'maternity', name: 'Maternity', count: samples.filter(s => s.category === 'maternity').length },
        { id: 'family', name: 'Family', count: samples.filter(s => s.category === 'family').length },
        { id: 'toddler', name: 'Toddler', count: samples.filter(s => s.category === 'toddler').length },
        { id: 'milestone', name: 'Milestone', count: samples.filter(s => s.category === 'milestone').length },
        { id: 'wedding', name: 'Wedding', count: samples.filter(s => s.category === 'wedding').length }
    ];

    // Filter samples based on category and search
    const filteredSamples = samples.filter(sample => {
        const matchesCategory = selectedCategory === 'all' || sample.category === selectedCategory;
        const matchesSearch = sample.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sample.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sample.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });


    const featuredSamples = samples.filter(s => s.featured).slice(0, 3);

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
            {/* Header Section - Matches Body style */}
            {/* Button for home */}
                <div className='absolute top-6 left-6 z-20'>
                        <button
                            onClick={() => window.location.href = '/main'}
                            className='flex items-center gap-2 bg-gray-50 hover:bg-gray-200 backdrop-blur-sm text-black px-3 py-2 rounded-lg transition-all duration-300 border border-gray/20'
                            >
                        <span className='text-sm font-medium'>
                            <FontAwesomeIcon icon={faArrowLeft} className='w-4 h-4' />
                        </span>
                    </button>
                <p className='text-sm text-black py-2 font-extralight'>To home page</p>
            </div>
            <div className='bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200'>
                <div className='max-w-7xl mx-auto px-6 py-12'>
                    <div className='flex items-center gap-3 mb-4'>
                        <img 
                            src={bgImg} 
                            alt="N&M Staffing Logo"   
                            className='w-20 h-20 rounded-xl shadow-md border-2 border-orange-300 object-cover'
                        />
                        <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                            <FontAwesomeIcon icon={faCamera} className='text-gray-600 text-xl' />
                        </div>
                        <h1 className='text-3xl font-light text-gray-800'>Our Portfolio</h1>
                    </div>
                    <div className='w-20 h-0.5 bg-gray-400 mb-6'></div>
                    
                    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl'>
                        <p className='text-gray-500 text-xs uppercase tracking-widest mb-3 font-light flex items-center gap-2'>
                            <span className='w-1 h-4 bg-gray-400'></span>
                            MINIMALIST | TIMELESS | PREMIUM SERVICE
                        </p>
                        <p className='text-gray-600 leading-relaxed'>
                            We offer professional photography services: newborn, maternity, and family milestones, 
                            to capture life's most precious moments with warmth and artistry. Browse through our 
                            collection of cherished memories below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            {featuredSamples.length > 0 && (
                <div className='max-w-7xl mx-auto px-4 py-12'>
                    <h2 className='text-2xl font-light text-gray-800 mb-6'>Featured Work</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {featuredSamples.map(sample => (
                            <div 
                                key={sample.id}
                                className='relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white'
                                onClick={() => setSelectedImage(sample)}
                            >
                                <div className='relative h-72 overflow-hidden'>
                                    <img 
                                        src={sample.image} 
                                        alt={sample.title}
                                        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                        <div className='absolute bottom-0 left-0 right-0 p-4'>
                                            <h3 className='text-white font-medium text-lg'>{sample.title}</h3>
                                            <p className='text-gray-300 text-sm'>{sample.subCategory}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='absolute top-3 right-3'>
                                    <span className='bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-lg'>
                                        Featured
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Gallery Section */}
            <div className='max-w-7xl mx-auto px-4 py-12'>
                {/* Search and Filter Bar - Matches Body style */}
                <div className='flex flex-col md:flex-row gap-4 mb-8'>
                    <div className='flex-1 relative'>
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm'
                        />
                        <input
                            type='text'
                            placeholder='Search samples...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm'
                        />
                    </div>
                    <button
                        className='flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-sm'
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        Filter
                    </button>
                </div>

                {/* Category Filters - Pills style */}
                <div className='flex flex-wrap gap-2 mb-8'>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                                selectedCategory === category.id
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {category.name} ({category.count})
                        </button>
                    ))}
                </div>

                {/* Samples Grid - Matches the style of your slideshow */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredSamples.map(sample => (
                        <div 
                            key={sample.id}
                            className='group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100'
                            onClick={() => setSelectedImage(sample)}
                        >
                            <div className='relative h-64 overflow-hidden'>
                                <img 
                                    src={sample.image} 
                                    alt={sample.title}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                />
                               
                                {sample.featured && (
                                    <span className='absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full'>
                                        Featured
                                    </span>
                                )}
                            </div>
                            <div className='p-4'>
                                <h3 className='font-medium text-gray-800 mb-1'>{sample.title}</h3>
                                <p className='text-sm text-gray-500 mb-3 line-clamp-2'>{sample.description}</p>
                                <div className='flex items-center justify-between text-xs'>
                                    <div className='flex items-center gap-1 text-gray-400'>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className='text-xs' />
                                        <span>{sample.location}</span>
                                    </div>
                                    <div className='flex items-center gap-1 text-gray-400'>
                                        <FontAwesomeIcon icon={faCalendarAlt} className='text-xs' />
                                        <span>{sample.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSamples.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <FontAwesomeIcon icon={faCamera} className='text-gray-400 text-2xl' />
                        </div>
                        <h3 className='text-lg font-medium text-gray-700 mb-2'>No samples found</h3>
                        <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Load More Button */}
                {filteredSamples.length > 0 && (
                    <div className='text-center mt-12'>
                        <button className='px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm'>
                            Load More Samples
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal - Matches your slideshow style */}
            {selectedImage && (
                <div 
                    className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className='absolute top-4 right-4 text-white hover:text-gray-300 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faTimes} className='text-xl' />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredSamples.findIndex(s => s.id === selectedImage.id);
                            if (currentIndex > 0) {
                                setSelectedImage(filteredSamples[currentIndex - 1]);
                            }
                        }}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredSamples.findIndex(s => s.id === selectedImage.id) === 0}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const currentIndex = filteredSamples.findIndex(s => s.id === selectedImage.id);
                            if (currentIndex < filteredSamples.length - 1) {
                                setSelectedImage(filteredSamples[currentIndex + 1]);
                            }
                        }}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                        disabled={filteredSamples.findIndex(s => s.id === selectedImage.id) === filteredSamples.length - 1}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>

                    <div 
                        className='relative max-w-5xl w-full'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={selectedImage.image} 
                            alt={selectedImage.title}
                            className='w-full h-auto rounded-lg shadow-2xl'
                        />
                        
                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 rounded-b-lg'>
                            <div className='flex items-center justify-between text-white'>
                                <div>
                                    <h3 className='text-2xl font-medium mb-1'>{selectedImage.title}</h3>
                                    <p className='text-sm text-gray-300 mb-2'>{selectedImage.description}</p>
                                    <div className='flex items-center gap-4 text-xs text-gray-400'>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            {selectedImage.date}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            {selectedImage.location}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faTag} />
                                            {selectedImage.subCategory}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'>
                                        <FontAwesomeIcon icon={faShare} className='text-white text-sm' />
                                    </button>
                                    <button className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'>
                                        <FontAwesomeIcon icon={faInfoCircle} className='text-white text-sm' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Samples;
