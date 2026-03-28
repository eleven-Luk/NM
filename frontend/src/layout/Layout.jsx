import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/Sidebar.jsx';

function Layout ({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>

            {/* MAIN CONTENT AREA - Scrollable */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
