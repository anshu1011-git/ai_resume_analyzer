import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    ArrowLeftOnRectangleIcon,
    SunIcon,
    MoonIcon,
    DocumentTextIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import authService from '../services/authService';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Layout = ({ toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'Compare Resumes', path: '/compare', icon: ChartBarIcon },
    ];

    return (
        <div className="flex h-screen overflow-hidden gradient-bg text-slate-800 dark:text-slate-100">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-64 glass hidden md:flex flex-col z-20 m-4 rounded-2xl shadow-2xl"
            >
                <div className="p-6">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                            <DocumentTextIcon className="w-5 h-5" />
                        </div>
                        Resulyze AI
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.name} to={item.path}>
                                <motion.div
                                    whileHover={{ x: 5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "flex items-center px-4 py-3 rounded-xl transition-all relative overflow-hidden group mb-2",
                                        isActive
                                            ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 font-medium"
                                            : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div layoutId="activeNavIndicator" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                                    )}
                                    <item.icon className={cn("h-5 w-5 mr-3 z-10", isActive ? "text-white" : "text-slate-500 group-hover:text-primary-500")} />
                                    <span className="z-10">{item.name}</span>
                                </motion.div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200/20 dark:border-slate-800/30">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative z-10 w-full h-full p-4 md:pl-0">
                <header className="h-20 glass rounded-2xl flex items-center justify-between px-8 mb-4 sticky top-0 z-30 shadow-sm">
                    <motion.h2
                        key={location.pathname}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent"
                    >
                        {navItems.find(i => i.path === location.pathname)?.name ||
                            (location.pathname.startsWith('/resume/') ? 'Resume Analysis' : 'Resulyze AI')}
                    </motion.h2>

                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleDarkMode}
                            className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            {isDarkMode ? <SunIcon className="h-5 w-5 text-yellow-500" /> : <MoonIcon className="h-5 w-5 text-slate-600" />}
                        </motion.button>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30 cursor-pointer"
                        >
                            U
                        </motion.div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.section
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                    >
                        <Outlet />
                    </motion.section>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
