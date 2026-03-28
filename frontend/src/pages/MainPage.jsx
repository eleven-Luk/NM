// MainPage.jsx
import React, { useRef } from 'react';
import { Outlet } from 'react-router-dom'; // Make sure to import Outlet
import Header from '../layout/Header.jsx';
import Body from '../layout/Body.jsx';
import Contact from '../layout/Contact.jsx';
import Footer from '../layout/Footer.jsx';

function MainPage() {
     const homeRef = useRef(null);

     const scrollToSection = (ref) => {
            if (ref.current) {
                const headerOffset = 100;
                const elementPosition = ref.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                 window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    
        
    return (
        <>
            <Header 
                onHomeClick={() => scrollToSection(homeRef)}
            />
            <div ref={homeRef}>
                <Body />
            </div>
            
            <Contact />
            
            {/* Optional separator when policy content is shown */}
            <div className="policy-content">
                <Outlet />
            </div>
            
            <Footer />
        </>
    )
}


export default MainPage;