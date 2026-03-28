// components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBriefcase,
    faUsers,
    faCommentAlt,
    faBusinessTime,
    faImage,
    faClock,
    faSignOutAlt,
    faUser,
    faExchangeAlt,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faChevronUp,
    faArchive
} from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [adminType, setAdminType] = useState('');
    const [openSubmenu, setOpenSubmenu] = useState(null);

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/nm-admin')) {
            setAdminType('nm-admin');
            // Auto-expand applicants submenu if on applicants or archive page
            if (path === '/nm-admin/applicants' || path === '/nm-admin/applicants/archived') {
                setOpenSubmenu('applicants');
            }
        } else if (path.startsWith('/maple-admin')) {
            setAdminType('maple-admin');
        }
    }, [location.pathname]);

    const toggleSubmenu = (menuName) => {
        if (openSubmenu === menuName) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(menuName);
        }
    };

    // ✅ Fixed: More precise active check
    const isActive = (path) => {
        if (adminType === 'nm-admin') {
            // For exact matches
            if (path === '/nm-admin') {
                return location.pathname === path;
            }
            // For other paths, check exact match, not startsWith
            return location.pathname === path;
        } else {
            if (path === '/maple-admin') {
                return location.pathname === path;
            }
            return location.pathname === path;
        }
    };

    // ✅ Check if a submenu item is active
    const isSubItemActive = (subPath) => {
        return location.pathname === subPath;
    };

    const getNavItems = () => {
        if (adminType === 'nm-admin') {
            return [
                { 
                    path: '/nm-admin', 
                    label: 'DASHBOARD', 
                    icon: faHome,
                    type: 'link'
                },
                { 
                    path: '/nm-admin/jobs', 
                    label: 'JOBS', 
                    icon: faBriefcase,
                    type: 'link'
                },
                { 
                    label: 'APPLICANTS', 
                    icon: faUsers,
                    type: 'submenu',
                    key: 'applicants',
                    subItems: [
                        { 
                            path: '/nm-admin/applicants', 
                            label: 'All Applicants', 
                            icon: faUsers 
                        },
                        { 
                            path: '/nm-admin/applicants/archived', 
                            label: 'Archive', 
                            icon: faArchive 
                        }
                    ]
                },
                { 
                    path: '/nm-admin/concerns', 
                    label: 'CONCERNS', 
                    icon: faCommentAlt,
                    type: 'link'
                },
            ];
        } else if (adminType === 'maple-admin') {
            return [
                { path: '/maple-admin', label: 'DASHBOARD', icon: faHome, type: 'link' },
                { path: '/maple-admin/appointments', label: 'APPOINTMENTS', icon: faBusinessTime, type: 'link' },
                { path: '/maple-admin/samples', label: 'SAMPLES', icon: faImage, type: 'link' },
                { path: '/maple-admin/schedules', label: 'SCHEDULES', icon: faClock, type: 'link' },
                { path: '/maple-admin/concerns', label: 'CONCERNS', icon: faCommentAlt, type: 'link' },
            ];
        }
        return [];
    };

    const navItems = getNavItems();

    const handleChangeAdmin = () => {
        if (adminType === 'maple-admin') {
            navigate('/nm-admin');
        } else {
            navigate('/maple-admin');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            setOpenSubmenu(null);
        }
    };

    const getColors = () => {
        if (adminType === 'nm-admin') {
            return {
                primary: 'bg-amber-100',
                primaryBorder: 'border-amber-200',
                primaryText: 'text-amber-900',
                primaryIcon: 'text-amber-700',
                accent: 'text-amber-600',
                lightBg: 'bg-amber-50',
                hover: 'hover:bg-amber-100',
                headerBorder: 'border-amber-200',
                userBadge: 'bg-amber-200 text-amber-800',
                pageTitle: 'text-stone-700',
                subtleGlow: 'shadow-amber-100/50'
            };
        } else {
            return {
                primary: 'bg-stone-200',
                primaryBorder: 'border-stone-300',
                primaryText: 'text-stone-800',
                primaryIcon: 'text-stone-600',
                accent: 'text-stone-600',
                lightBg: 'bg-stone-100',
                hover: 'hover:bg-stone-200',
                headerBorder: 'border-stone-300',
                userBadge: 'bg-stone-300 text-stone-800',
                pageTitle: 'text-stone-700',
                subtleGlow: 'shadow-stone-200/50'
            };
        }
    };

    const colors = getColors();

    return (
        <div className={`h-screen bg-white text-stone-700 border-r border-stone-200 transition-all duration-300 flex flex-col relative shadow-md
            ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between border-b ${colors.headerBorder} ${colors.lightBg}`}>
                {!isCollapsed && (
                    <h2 className={`text-lg font-medium ${colors.pageTitle} tracking-wide`}>
                        {adminType === 'nm-admin' ? 'N&M Staffing' : 'Maple Street'}
                    </h2>
                )}
                <button
                    onClick={handleToggle}
                    className={`p-1.5 rounded-md ${colors.hover} transition-colors ${colors.accent}`}
                >
                    <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} size="sm" />
                </button>
            </div>

            {/* User Info */}
            <div className={`p-4 border-b ${colors.headerBorder} flex items-center gap-3`}>
                <div className={`w-8 h-8 rounded-full ${colors.userBadge} flex items-center justify-center shadow-inner`}>
                    <FontAwesomeIcon icon={faUser} className={`text-sm ${colors.primaryIcon}`} />
                </div>
                {!isCollapsed && (
                    <div>
                        <p className="text-sm font-medium text-stone-700">Admin</p>
                        <p className={`text-xs ${colors.accent}`}>
                            {adminType === 'nm-admin' ? 'N&M Staffing Services' : 'Maple Street Photography'}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            {item.type === 'submenu' ? (
                                <>
                                    {/* Submenu Toggle Button */}
                                    <button
                                        onClick={() => toggleSubmenu(item.key)}
                                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md transition-all text-sm
                                            ${openSubmenu === item.key ? colors.primary : ''}
                                            ${colors.hover}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon 
                                                icon={item.icon} 
                                                className={`w-4 h-4 ${openSubmenu === item.key ? colors.primaryIcon : 'text-stone-400'}`} 
                                            />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            <FontAwesomeIcon 
                                                icon={openSubmenu === item.key ? faChevronUp : faChevronDown} 
                                                className="text-xs text-stone-400"
                                            />
                                        )}
                                    </button>
                                    
                                    {/* Submenu Items */}
                                    {!isCollapsed && openSubmenu === item.key && (
                                        <ul className="ml-8 mt-1 space-y-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.path}>
                                                    <button
                                                        onClick={() => navigate(subItem.path)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all
                                                            ${isSubItemActive(subItem.path) 
                                                                ? `${colors.primary} ${colors.primaryText} font-medium` 
                                                                : `text-stone-600 ${colors.hover}`
                                                            }`}
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={subItem.icon} 
                                                            className={`w-3.5 h-3.5 ${
                                                                isSubItemActive(subItem.path) ? colors.primaryIcon : 'text-stone-400'
                                                            }`} 
                                                        />
                                                        <span>{subItem.label}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            ) : (
                                /* Regular Link */
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm
                                        ${isActive(item.path) 
                                            ? `${colors.primary} ${colors.primaryText} font-medium shadow-sm ${colors.subtleGlow}` 
                                            : `text-stone-600 ${colors.hover}`
                                        }`}
                                >
                                    <FontAwesomeIcon 
                                        icon={item.icon} 
                                        className={`w-4 h-4 ${
                                            isActive(item.path) ? colors.primaryIcon : 'text-stone-400'
                                        }`} 
                                    />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Switch Admin */}
            <div className="p-3 border-t border-stone-200">
                <button
                    onClick={handleChangeAdmin}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-stone-600 ${colors.hover} transition-colors group`}
                >
                    <FontAwesomeIcon 
                        icon={faExchangeAlt} 
                        className={`w-4 h-4 text-stone-400 group-hover:${colors.primaryIcon} transition-colors`} 
                    />
                    {!isCollapsed && (
                        <span className={`truncate group-hover:${colors.primaryText}`}>
                            {adminType === 'maple-admin' ? 'Switch to N&M' : 'Switch to Maple'}
                        </span>
                    )}
                </button>
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-stone-200">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-stone-600 hover:bg-stone-100 transition-colors group`}
                >
                    <FontAwesomeIcon 
                        icon={faSignOutAlt} 
                        className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" 
                    />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}

export default Sidebar;