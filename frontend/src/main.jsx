import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './layout/Layout.jsx';

import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import MainPage from './pages/MainPage.jsx';
import ChoosePage from './pages/ChoosePage.jsx';



// Maple Pages
import MapleTermsOfService from './pages/Maple/MaplePrivacyPolicy.jsx';
import MaplePrivacyPolicy from './pages/Maple/MaplePrivacyPolicy.jsx';
import AboutMaple from './pages/Maple/AboutMaple.jsx';
import MDashboard from './pages/Maple/MDashboard.jsx';
import MSamples from './pages/Maple/MSamples.jsx';
import MAppointments from './pages/Maple/MAppointments.jsx';
import MSchedules from './pages/Maple/MSchedules.jsx';
import MConcerns from './pages/Maple/MConcerns.jsx';
import Samples from './pages/Maple/Samples.jsx'



// NM Pages
import NMTermsOfService from './pages/NM/NMTermsOfService.jsx';
import NMPrivacyPolicy from './pages/NM/NMPrivacyPolicy.jsx';
import AboutNM from './pages/NM/AboutNM.jsx';
import NMDashboard from './pages/NM/NMDashboard.jsx';
import NMApplicants from './pages/NM/NMApplicants.jsx';
import NMApplicantsArchive from './pages/NM/NMArchivedApplicants.jsx';
import NMJobs from './pages/NM/NMJobs.jsx';
import NMConcerns from './pages/NM/NMConcerns.jsx';
import Jobs from './pages/NM/Jobs.jsx';




// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/main',
    element: <MainPage />, // This is your home page with Header, Body, Contact, Footer
  },
  // Policy pages as separate routes (NOT nested under /main)
  {
    path: '/maple-privacy-policy',
    element: <MaplePrivacyPolicy />,
  },
  {
    path: '/maple-terms-of-service',
    element: <MapleTermsOfService />,
  },
  {
    path: '/nm-privacy-policy',
    element: <NMPrivacyPolicy />,
  },
  {
    path: '/nm-terms-of-service',
    element: <NMTermsOfService />,
  },
  {
    path: '/samples',
    element: <Samples />,
  },
  {
    path: '/jobs',
    element: <Jobs />,
  },
  {
    path: '/about-maple',
    element: <AboutMaple />,
  },
  ,{
    path: '/about-nm',
    element: <AboutNM />,
  },{
    path: '/choose',
    element: <ChoosePage />,
  },
  {
    path:'/nm-admin',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <NMDashboard />
      },
      {
        path: 'applicants',
        element: <NMApplicants />
      },
      {
        path: 'applicants/archived',
        element: <NMApplicantsArchive />
      },
      {
        path: 'jobs',
        element: <NMJobs />
      },
      {
        path: 'concerns',
        element: <NMConcerns />
      }
    ]
  },{
    path:'/maple-admin',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <MDashboard />
      },
      {
        path: 'samples',
        element: <MSamples />
      },
      {
        path: 'appointments',
        element: <MAppointments />
      },
      {
        path: 'schedules',
        element: <MSchedules />
      },
      {
        path: 'concerns',
        element: <MConcerns />
      },
    ]
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600">Page not found</p>
          <a href="/login" className="mt-4 inline-block text-blue-500 hover:text-blue-600">
            Go to Login
          </a>
        </div>
      </div>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)