import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import authService from '../services/authService';
import { Button } from '../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorShake, setErrorShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorShake(false);
        try {
            await authService.login(email, password);
            setSuccess(true);
            toast.success('Logged in successfully!');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setErrorShake(true);
            toast.error(err.response?.data?.detail || 'Login failed');
            setTimeout(() => setErrorShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center mb-4 mx-auto">
                        <DocumentTextIcon className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to Resulyze AI</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 bg-green-50 dark:bg-green-900/20 rounded-xl"
                        >
                            <CheckCircleIcon className="w-12 h-12 text-green-500 mb-2" />
                            <p className="text-lg font-semibold text-green-700 dark:text-green-400">Login successful!</p>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || success}
                        className="w-full py-3 rounded-lg font-semibold"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        Register for free
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
