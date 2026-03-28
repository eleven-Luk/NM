import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faStar,
    faLeaf,
    faClock,
    faAward,
    faPlay,
    faPause,
    faVolumeUp,
    faVolumeMute,
    faTimes,
    faChevronLeft,
    faChevronRight,
    faInfoCircle,
    faCalendarAlt,
    faMapMarkerAlt,
    faTag,
    faExpand,
    faArrowLeft,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';


// Import images
import NielLogo from '../../assets/NielLogo.jpg';
import Owner from '../../assets/MaplePic6.jpg';
import Team1 from '../../assets/MaplePic7.jpg'
import Team2 from '../../assets/MaplePic1.jpg'
import Studio from '../../assets/MaplePic4.png'

// Import videos
import NewbornSession from '../../assets/videos/Vid1.mp4';
import MaternitySession from '../../assets/videos/Vid3.mp4';

function AboutMaple() {
    const [playingVideo, setPlayingVideo] = useState(null);
    const [mutedStates, setMutedStates] = useState({});
    const [selectedVideo, setSelectedVideo] = useState(null);
    const videoRefs = useRef({});
    const modalVideoRef = useRef(null);

    // Behind the scenes videos
    const behindScenesVideos = [
        {
            id: 1,
            video: NewbornSession,
            title: "Newborn Session Behind the Scenes",
            description: "Watch how we gently capture those precious first moments",
            date: "March 2026",
            location: "Studio",
            category: "Newborn",
        },
        {
            id: 2,
            video: MaternitySession,
            title: "Maternity Glow Session",
            description: "Celebrating the beauty of new life and motherhood",
            date: "March 2026",
            location: "Studio",
            category: "Maternity",
        }
    ];

    const togglePlay = (videoId, e) => {
        e.stopPropagation(); // Prevent opening modal
        const videoElement = videoRefs.current[videoId];
        
        if (playingVideo === videoId) {
            videoElement.pause();
            setPlayingVideo(null);
        } else {
            // Pause any currently playing video
            if (playingVideo && videoRefs.current[playingVideo]) {
                videoRefs.current[playingVideo].pause();
            }
            
            // Play the new video
            videoElement.play();
            setPlayingVideo(videoId);
        }
    };

    const toggleMute = (videoId, e) => {
        e.stopPropagation(); // Prevent opening modal
        setMutedStates(prev => ({
            ...prev,
            [videoId]: !prev[videoId]
        }));
    };

    const openVideoModal = (video) => {
        setSelectedVideo(video);
        // Pause any playing video in the grid
        if (playingVideo) {
            videoRefs.current[playingVideo]?.pause();
            setPlayingVideo(null);
        }
    };

    const closeVideoModal = () => {
        // Pause modal video when closing
        if (modalVideoRef.current) {
            modalVideoRef.current.pause();
        }
        setSelectedVideo(null);
    };

    const navigateVideo = (direction) => {
        const currentIndex = behindScenesVideos.findIndex(v => v.id === selectedVideo.id);
        let newIndex;
        
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : behindScenesVideos.length - 1;
        } else {
            newIndex = currentIndex < behindScenesVideos.length - 1 ? currentIndex + 1 : 0;
        }
        
        setSelectedVideo(behindScenesVideos[newIndex]);
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
            {/* Hero Section - Reduced size */}
            <div className='relative h-[70vh] min-h-[500px] overflow-hidden bg-gray-900'>
                {/* Background */}
                <div className='absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800'></div>
                
                {/* Overlay */}
                <div className='absolute inset-0 bg-black/40'></div>
                
                {/* Button for home */}
                <div className='absolute top-6 left-6 z-20'>
                    <button
                        onClick={() => window.location.href = '/main'}
                        className='flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30'
                    >
                        <span className='text-sm font-medium'>
                            <FontAwesomeIcon icon={faArrowLeft} className='w-4 h-4' />
                        </span>
                    </button>
                    <p className='text-sm text-white py-2 font-extralight'>To home page</p>
                </div>

                {/* Button for Samples */}
                <div className='absolute top-6 right-4 z-20'>
                    <button
                        onClick={() => window.location.href = '/samples'}
                        className='flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg transition-all duration-300 border border-white/20 hover:border-white/30'
                    >
                        <span className='text-sm font-medium'>
                            <FontAwesomeIcon icon={faArrowRight} className='w-4 h-4' />
                        </span>
                    </button>
                    <p className='text-sm text-white py-2 font-extralight'>To samples page</p>
                </div>
                
                {/* Content */}
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                    <div className='text-center text-white max-w-4xl px-4'>
                        <div className='flex items-center justify-center gap-4 mb-6'>
                            <img 
                                src={NielLogo} 
                                alt="Maple Street Logo" 
                                className='w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover'
                            />
                            <div className='text-left'>
                                <h1 className='text-4xl md:text-5xl font-light mb-2'>Maple Street Photography</h1>
                                <p className='text-gray-200 text-lg md:text-xl'>Capturing Life's Most Beautiful Moments</p>
                            </div>
                        </div>
                        <div className='w-100 h-0.5 bg-orange-400 mx-auto mb-6'></div>
                        <p className='text-base md:text-lg text-gray-200 leading-relaxed max-w-1xl mx-auto'>
                            We believe that life's most beautiful stories are written in the quiet, candid moments. 
                            Since 2019, we've been preserving memories with warmth, artistry, and a minimalist touch.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className='max-w-7xl mx-auto px-6 py-16'>
                <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div>
                        <h2 className='text-3xl font-light text-gray-800 mb-4'>Our Story</h2>
                        <div className='w-16 h-0.5 bg-gray-400 mb-6'></div>
                        <p className='text-gray-600 leading-relaxed mb-4'>
                            Founded in 2019 by Neil Aaron Maple, Maple Street Photography began with a simple mission: 
                            to capture the authentic emotions and genuine connections that make life beautiful. What started 
                            as a passion for photographing family gatherings quickly grew into a full-service photography 
                            studio specializing in life's most precious milestones.
                        </p>
                        <p className='text-gray-600 leading-relaxed mb-4'>
                            Based in the heart of Quezon City, we've had the privilege of documenting hundreds of 
                            newborn firsts, maternity glows, family laughter, and love stories. Our approach is simple — 
                            we don't just take pictures; we create heirlooms that families will cherish for generations.
                        </p>
                        <p className='text-gray-600 leading-relaxed'>
                            Every session with us is an experience. From the moment you book to the day you receive 
                            your gallery, we're with you every step of the way, ensuring your memories are preserved 
                            with the care and artistry they deserve.
                        </p>
                    </div>
                    <div className='relative'>
                        <img 
                            src={Studio} 
                            alt="Maple Street Studio" 
                            className='rounded-xl shadow-xl hover:scale-105 transition-all duration-300'
                        />
                        <div className='absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg'>
                            <p className='text-gray-800 font-medium'>5+ Years</p>
                            <p className='text-sm text-gray-500'>Of Storytelling</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Behind the Scenes Video Gallery */}
            <div className='bg-gray-50 py-16'>
                <div className='max-w-7xl mx-auto px-6'>
                    <h2 className='text-3xl font-light text-gray-800 mb-4 text-center'>Behind the Lens</h2>
                    <div className='w-16 h-0.5 bg-gray-400 mb-4 mx-auto'></div>
                    <p className='text-gray-500 text-center mb-12 max-w-2xl mx-auto'>
                        Click play to watch inline • Click video to view full screen
                    </p>
                    
                    <div className='grid md:grid-cols-2 gap-6 max-w-6xl mx-auto'>
                        {behindScenesVideos.map(video => (
                            <div 
                                key={video.id}
                                className='bg-white rounded-xl shadow-md overflow-hidden group'
                            >
                                <div 
                                    className='relative h-92 bg-black cursor-pointer'
                                    onClick={() => openVideoModal(video)}
                                >
                                    <video 
                                        ref={el => videoRefs.current[video.id] = el}
                                        src={video.video}
                                        loop
                                        muted={mutedStates[video.id] || false}
                                        playsInline
                                        className='w-full h-full object-cover'
                                    />
                                    
                                    {/* Play Button - Inline play */}
                                    <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                                        <button 
                                            onClick={(e) => togglePlay(video.id, e)}
                                            className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-colors'
                                        >
                                            <FontAwesomeIcon 
                                                icon={playingVideo === video.id ? faPause : faPlay} 
                                                className={playingVideo === video.id ? 'text-gray-800 text-2xl' : 'text-gray-800 text-2xl ml-1'} 
                                            />
                                        </button>
                                    </div>
                                    
                                    {/* Sound Control */}
                                    <button 
                                        onClick={(e) => toggleMute(video.id, e)}
                                        className='absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors'
                                    >
                                        <FontAwesomeIcon icon={mutedStates[video.id] ? faVolumeMute : faVolumeUp} className='text-sm' />
                                    </button>
                                    
                                    {/* Duration Badge */}
                                    <span className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                                        {video.duration}
                                    </span>

                                    {/* Expand/Caption */}
                                    <div className='absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1'>
                                        <FontAwesomeIcon icon={faExpand} className='text-xs' />
                                        <span>Click to expand</span>
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <h3 className='font-medium text-gray-800 mb-1'>{video.title}</h3>
                                    <p className='text-sm text-gray-500'>{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className='max-w-7xl mx-auto px-6 py-16'>
                <h2 className='text-3xl font-light text-gray-800 mb-4 text-center'>Our Philosophy</h2>
                <div className='w-16 h-0.5 bg-gray-400 mb-12 mx-auto'></div>
                
                <div className='grid md:grid-cols-3 gap-8'>
                    <div className='bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto'>
                            <FontAwesomeIcon icon={faLeaf} className='text-gray-600 text-2xl' />
                        </div>
                        <h3 className='text-xl font-medium text-gray-800 mb-3 text-center'>Minimalist</h3>
                        <p className='text-gray-600 text-center text-sm leading-relaxed'>
                            We believe in simplicity. Clean compositions, natural light, and unposed moments 
                            that let your true beauty shine through.
                        </p>
                    </div>
                    
                    <div className='bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto'>
                            <FontAwesomeIcon icon={faClock} className='text-gray-600 text-2xl' />
                        </div>
                        <h3 className='text-xl font-medium text-gray-800 mb-3 text-center'>Timeless</h3>
                        <p className='text-gray-600 text-center text-sm leading-relaxed'>
                            Images that never go out of style. We avoid trendy edits so your photos look 
                            just as beautiful decades from now.
                        </p>
                    </div>
                    
                    <div className='bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto'>
                            <FontAwesomeIcon icon={faAward} className='text-gray-600 text-2xl' />
                        </div>
                        <h3 className='text-xl font-medium text-gray-800 mb-3 text-center'>Premium Service</h3>
                        <p className='text-gray-600 text-center text-sm leading-relaxed'>
                            From consultation to delivery, we provide a premium experience that makes you 
                            feel comfortable, valued, and cared for.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className='bg-gray-50 py-16'>
                <div className='max-w-7xl mx-auto px-6'>
                    <h2 className='text-3xl font-light text-gray-800 mb-4 text-center'>Meet the Team</h2>
                    <div className='w-16 h-0.5 bg-gray-400 mb-12 mx-auto'></div>
                    
                    {/* Individual Team Members - 2 columns */}
                    <div className='grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12'>
                        {/* Neil */}
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <div className='relative h-80'>
                                <img 
                                    src={Owner} 
                                    alt="Neil Aaron" 
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='p-6'>
                                <h3 className='text-xl font-medium text-gray-800 mb-1'>Neil Aaron Tupaz</h3>
                                <p className='text-sm text-orange-500 mb-3'>Founder & Lead Photographer</p>
                                <p className='text-gray-600 text-sm'>
                                    With over 8 years of experience, Neil brings an artistic eye and calming presence to every session. 
                                    Specializing in newborn and family photography, he has a gift for capturing genuine emotions.
                                </p>
                            </div>
                        </div>
                        
                        {/* Marie */}
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <div className='relative h-80'>
                                <img 
                                    src={Team1} 
                                    alt="Marie Tupaz" 
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='p-6'>
                                <h3 className='text-xl font-medium text-gray-800 mb-1'>Marie Tupaz</h3>
                                <p className='text-sm text-orange-500 mb-3'>Associate Photographer</p>
                                <p className='text-gray-600 text-sm'>
                                    Marie specializes in maternity and portrait sessions. Her warm personality puts clients at ease, 
                                    resulting in natural, beautiful images that reflect each family's unique dynamic.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Team Group Photo - Full width below */}
                    <div className='max-w-2xl mx-auto'>
                        <div className='bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-300'>
                            <div className='relative h-90'>
                                <img 
                                    src={Team2} 
                                    alt="Maple Street Photography Team" 
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='p-8 text-center'>
                                <h3 className='text-2xl font-medium text-gray-800 mb-3'>The Maple Street Family</h3>
                                <p className='text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed'>
                                    Behind every beautiful photo is a team of passionate storytellers. 
                                    Together, we work to make every session comfortable, enjoyable, and memorable — 
                                    because your family deserves nothing less.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Lightbox Modal */}
            {selectedVideo && (
                <div 
                    className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
                    onClick={closeVideoModal}
                >
                    {/* Close button */}
                    <button
                        onClick={closeVideoModal}
                        className='absolute top-4 right-4 text-white hover:text-gray-300 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faTimes} className='text-xl' />
                    </button>
                    
                    {/* Navigation buttons */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateVideo('prev');
                        }}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigateVideo('next');
                        }}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center'
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>

                    {/* Video container */}
                    <div 
                        className='relative max-w-4xl w-full'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video 
                            ref={modalVideoRef}
                            src={selectedVideo.video}
                            controls
                            autoPlay
                            playsInline
                            className='w-full h-auto rounded-lg shadow-2xl'
                        />
                        
                        {/* Video info overlay */}
                        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 rounded-b-lg'>
                            <div className='flex items-center justify-between text-white'>
                                <div>
                                    <h3 className='text-xl font-medium mb-1'>{selectedVideo.title}</h3>
                                    <p className='text-sm text-gray-300 mb-2'>{selectedVideo.description}</p>
                                    <div className='flex items-center gap-4 text-xs text-gray-400'>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            {selectedVideo.date}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            {selectedVideo.location}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <FontAwesomeIcon icon={faTag} />
                                            {selectedVideo.category}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            Duration: {selectedVideo.duration}
                                        </span>
                                    </div>
                                </div>
                                <button className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'>
                                    <FontAwesomeIcon icon={faInfoCircle} className='text-white text-xs' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Call to Action */}
            <div className='relative h-96 overflow-hidden bg-gray-800'>
                <div className='absolute inset-0 bg-black/60'></div>
                
                <div className='relative z-10 h-full flex items-center justify-center text-center text-white'>
                    <div>
                        <h2 className='text-3xl font-light mb-4'>Ready to Create Your Story?</h2>
                        <p className='text-gray-200 mb-8 max-w-2xl mx-auto'>
                            Let's capture your family's precious moments together. Book a session today.
                        </p>
                        <button className='bg-white text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors'>
                            Book a Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutMaple;