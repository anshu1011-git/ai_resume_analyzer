import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import authService from '../services/authService';
import { Button } from '../components/ui/Button';

// Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
    const calculateStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return Math.min(score, 4);
    };

    const strength = calculateStrength(password);

    const getColor = () => {
        switch (strength) {
            case 0: return "bg-slate-300";
            case 1: return "bg-red-500";
            case 2: return "bg-orange-500";
            case 3: return "bg-yellow-500";
            case 4: return "bg-green-500";
            default: return "bg-slate-300";
        }
    };

    const getLabel = () => {
        switch (strength) {
            case 0: return "";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Strong";
            default: return "";
        }
    };

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Password strength</span>
                <span className={`text-xs font-medium ${strength > 0 ? "text-slate-600 dark:text-slate-300" : "text-transparent"}`}>{getLabel()}</span>
            </div>
            <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`flex-1 rounded-full transition-all ${strength >= level ? getColor() : 'bg-slate-200 dark:bg-slate-600'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const Register = () => {
    const [name, setName] = useState('');
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
            await authService.register(name, email, password);
            setSuccess(true);
            toast.success('Registration successful! Please login.');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            setErrorShake(true);
            toast.error(err.response?.data?.detail || 'Registration failed');
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400">Join Resulyze to boost your career</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-8 bg-green-50 dark:bg-green-900/20 rounded-xl"
                        >
                            <CheckCircleIcon className="w-12 h-12 text-green-500 mb-2" />
                            <p className="text-lg font-semibold text-green-700 dark:text-green-400">Registration successful!</p>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                        <PasswordStrengthMeter password={password} />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading || success}
                        className="w-full py-3 rounded-lg font-semibold"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
