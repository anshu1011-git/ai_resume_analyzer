import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    ArrowsRightLeftIcon,
    DocumentTextIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import resumeService from '../services/resumeService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const ResumeCompare = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResume1, setSelectedResume1] = useState(null);
    const [selectedResume2, setSelectedResume2] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const data = await resumeService.getResumes();
            setResumes(data);
        } catch (err) {
            toast.error('Failed to load resumes for comparison');
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = () => {
        if (!selectedResume1 || !selectedResume2) {
            toast.warning('Please select two resumes to compare');
            return;
        }
        if (selectedResume1 === selectedResume2) {
            toast.warning('Please select two different resumes');
            return;
        }
        setShowComparison(true);
    };

    const handleSelectionChange = (setter) => (e) => {
        setter(e.target.value);
        setShowComparison(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4 inline-flex items-center">
                    <ArrowsRightLeftIcon className="w-10 h-10 mr-4 text-primary-500" />
                    Compare Resumes
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    Select two resumes to see a side-by-side comparison of their skills, ATS compatibility, and overall scores to see which performs better.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : resumes.length < 2 ? (
                <Card className="max-w-xl mx-auto bg-slate-50 dark:bg-slate-900 border-dashed border-2">
                    <CardContent className="p-10 text-center flex flex-col items-center">
                        <DocumentTextIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Not enough resumes</h3>
                        <p className="text-slate-500 mb-6">You need at least 2 processed resumes to use the comparison feature.</p>
                        <Button onClick={() => navigate('/')}>
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Upload More Resumes
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Selector 1 */}
                        <Card className="glass relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary-500"></div>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Resume 1 (Baseline)</h3>
                                <select
                                    className="w-full p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                                    value={selectedResume1 || ''}
                                    onChange={handleSelectionChange(setSelectedResume1)}
                                >
                                    <option value="" disabled>Select a resume...</option>
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>{r.original_filename} ({r.overall_score}%)</option>
                                    ))}
                                </select>
                            </CardContent>
                        </Card>

                        {/* Selector 2 */}
                        <Card className="glass relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-secondary-500"></div>
                            <CardContent className="p-6">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Resume 2 (Comparison)</h3>
                                <select
                                    className="w-full p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-secondary-500 outline-none transition-shadow"
                                    value={selectedResume2 || ''}
                                    onChange={handleSelectionChange(setSelectedResume2)}
                                >
                                    <option value="" disabled>Select a resume...</option>
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>{r.original_filename} ({r.overall_score}%)</option>
                                    ))}
                                </select>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleCompare}
                            disabled={!selectedResume1 || !selectedResume2 || selectedResume1 === selectedResume2}
                            className="px-12 py-6 text-lg font-black bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-xl shadow-primary-500/20 border-none transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowsRightLeftIcon className="w-6 h-6 mr-3" />
                            Compare Now
                        </Button>
                    </div>
                </div>
            )}

            {/* Comparison Results Area */}
            {showComparison && selectedResume1 && selectedResume2 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="mt-12 space-y-8"
                >
                    {(() => {
                        const r1 = resumes.find(r => r.id === parseInt(selectedResume1));
                        const r2 = resumes.find(r => r.id === parseInt(selectedResume2));

                        if (!r1 || !r2) return null;

                        const r1Data = r1.ai_response_json;
                        const r2Data = r2.ai_response_json;

                        return (
                            <>
                                {/* Score Comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <motion.div variants={itemVariants} className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-3xl text-center border border-primary-100 dark:border-primary-900/50 relative overflow-hidden">
                                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full blur-3xl opacity-50"></div>
                                        <p className="font-bold text-slate-500 truncate mb-4">{r1.original_filename}</p>
                                        <p className="text-5xl font-black text-primary-600 dark:text-primary-400">{r1.overall_score}%</p>
                                        <p className="text-sm font-bold text-primary-400 uppercase tracking-widest mt-2">{r1.overall_score > r2.overall_score ? 'Winner 🏆' : ''}</p>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="text-center">
                                        <div className="inline-flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
                                            <span className="text-2xl font-black text-slate-400">VS</span>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="bg-secondary-50 dark:bg-secondary-900/20 p-6 rounded-3xl text-center border border-secondary-100 dark:border-secondary-900/50 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-200 dark:bg-secondary-800 rounded-full blur-3xl opacity-50"></div>
                                        <p className="font-bold text-slate-500 truncate mb-4">{r2.original_filename}</p>
                                        <p className="text-5xl font-black text-secondary-600 dark:text-secondary-400">{r2.overall_score}%</p>
                                        <p className="text-sm font-bold text-secondary-400 uppercase tracking-widest mt-2">{r2.overall_score > r1.overall_score ? 'Winner 🏆' : ''}</p>
                                    </motion.div>
                                </div>

                                {/* Detailed Metrics */}
                                <motion.div variants={itemVariants}>
                                    <Card className="shadow-lg">
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                                            <th className="p-6 font-bold text-slate-500 rounded-tl-3xl">Metric</th>
                                                            <th className="p-6 font-bold text-primary-500 w-2/5">{r1.original_filename}</th>
                                                            <th className="p-6 font-bold text-secondary-500 w-2/5 rounded-tr-3xl">{r2.original_filename}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                        <tr>
                                                            <td className="p-6 font-medium text-slate-700 dark:text-slate-300">ATS Score</td>
                                                            <td className="p-6">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-bold">{r1.ats_score}%</span>
                                                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${r1.ats_score}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-6">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-bold">{r2.ats_score}%</span>
                                                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${r2.ats_score}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-6 font-medium text-slate-700 dark:text-slate-300">Skills Detected</td>
                                                            <td className="p-6">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {r1Data?.skills_detected?.slice(0, 5).map(s => (
                                                                        <span key={s} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-md">{s}</span>
                                                                    ))}
                                                                    {r1Data?.skills_detected?.length > 5 && <span className="px-2 py-1 text-xs text-slate-500">+{r1Data.skills_detected.length - 5} more</span>}
                                                                </div>
                                                            </td>
                                                            <td className="p-6">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {r2Data?.skills_detected?.slice(0, 5).map(s => (
                                                                        <span key={s} className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 text-xs rounded-md">{s}</span>
                                                                    ))}
                                                                    {r2Data?.skills_detected?.length > 5 && <span className="px-2 py-1 text-xs text-slate-500">+{r2Data.skills_detected.length - 5} more</span>}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-6 font-medium text-slate-700 dark:text-slate-300">Quality Feedback</td>
                                                            <td className="p-6 text-sm text-slate-600 dark:text-slate-400 italic">"{r1Data?.grammar_feedback?.slice(0, 80)}..."</td>
                                                            <td className="p-6 text-sm text-slate-600 dark:text-slate-400 italic">"{r2Data?.grammar_feedback?.slice(0, 80)}..."</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
};

export default ResumeCompare;
