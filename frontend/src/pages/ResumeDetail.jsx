import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    CheckBadgeIcon,
    ExclamationCircleIcon,
    LightBulbIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import resumeService from '../services/resumeService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { SkillsRadarChart } from '../components/charts/SkillsRadarChart';
import { JobMatcher } from '../components/ui/JobMatcher';

const ResumeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'job-match'

    useEffect(() => {
        fetchResume();
    }, [id]);

    const fetchResume = async () => {
        try {
            const data = await resumeService.getResume(id);
            setResume(data);
        } catch (err) {
            toast.error('Failed to load analysis results');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const toastId = toast.loading('Generating PDF Report...');
        try {
            await resumeService.downloadReport(id);
            toast.update(toastId, { render: 'Report downloaded successfully!', type: 'success', isLoading: false, autoClose: 3000 });
        } catch (err) {
            toast.update(toastId, { render: 'Failed to download report', type: 'error', isLoading: false, autoClose: 3000 });
        }
    };

    // Export Handler (JSON/CSV)
    const handleExport = (format) => {
        if (!resume) return;
        const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);
        try {
            const dataStr = format === 'json' ?
                "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2)) :
                "data:text/csv;charset=utf-8," + encodeURIComponent(`Filename,Score,ATS_Score\n${resume.original_filename},${resume.overall_score},${resume.ats_score}`);

            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `resume_analysis_${id}.${format}`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            toast.update(toastId, { render: `Exported to ${format.toUpperCase()}`, type: 'success', isLoading: false, autoClose: 3000 });
        } catch (err) {
            toast.update(toastId, { render: `Export failed`, type: 'error', isLoading: false, autoClose: 3000 });
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-r-4 border-secondary-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-6 rounded-full border-b-4 border-blue-400 animate-spin" style={{ animationDuration: '2s' }}></div>
                <SparklesIcon className="w-8 h-8 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent animate-pulse">
                Decrypting AI Analysis...
            </p>
        </div>
    );

    if (!resume) return null;

    const data = resume.ai_response_json;

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto pb-20 space-y-8"
        >
            {/* Header & Export Panel */}
            <motion.div variants={fadeUpVariants} className="flex flex-col md:flex-row items-center justify-between gap-4 glass p-4 rounded-2xl sticky top-2 z-20 shadow-md">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back
                </Button>

                <div className="flex bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1 overflow-hidden">
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-white dark:bg-slate-800 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        AI Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('job-match')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'job-match' ? 'bg-white dark:bg-slate-800 shadow text-secondary-600 dark:text-secondary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Job Compatibility
                    </button>
                </div>

                <div className="flex gap-2">
                    <div className="hidden md:flex bg-slate-100/50 dark:bg-slate-900/50 rounded-xl p-1">
                        <Button variant="ghost" size="sm" onClick={() => handleExport('json')} className="text-xs text-sky-600 hover:text-sky-700">JSON</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExport('csv')} className="text-xs text-emerald-600 hover:text-emerald-700">CSV</Button>
                    </div>

                    <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/30 border-none"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Download PDF</span>
                    </Button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === 'analysis' && (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Hero Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div variants={fadeUpVariants} className="lg:col-span-2">
                                <Card className="h-full bg-gradient-to-br from-primary-900 via-slate-800 to-slate-900 text-white border-0 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                        <DocumentTextIcon className="h-64 w-64 text-primary-400" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>

                                    <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="inline-flex items-center space-x-2 bg-primary-500/20 text-primary-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-6 border border-primary-500/30">
                                                <SparklesIcon className="w-4 h-4" />
                                                <span>AI Intelligence Report</span>
                                            </div>
                                            <h1 className="text-3xl md:text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                                {resume.original_filename}
                                            </h1>
                                            <p className="text-slate-400 max-w-lg leading-relaxed text-sm md:text-base">
                                                {data.grammar_feedback || "Overall impression indicates a well-structured professional document."}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                                            <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Recommended Career Paths</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {data.recommended_roles?.map((role, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-secondary-500/20 text-secondary-300 border border-secondary-500/30 rounded-lg text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Core Metrics Column */}
                            <motion.div variants={fadeUpVariants} className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                                <Card className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800/80 dark:to-slate-900 shadow-blue-500/5">
                                    <CircularProgress
                                        value={resume.overall_score}
                                        size={140}
                                        strokeWidth={12}
                                        label="Overall Score"
                                        color={resume.overall_score > 70 ? "success" : resume.overall_score > 40 ? "warning" : "danger"}
                                    />
                                    <p className={`mt-4 text-sm font-bold ${resume.overall_score > 70 ? "text-green-500" :
                                        resume.overall_score > 40 ? "text-yellow-500" : "text-red-500"
                                        }`}>
                                        {resume.overall_score > 70 ? 'Strong Candidate' : resume.overall_score > 40 ? 'Needs Improvement' : 'Major Overhaul Required'}
                                    </p>
                                </Card>
                                <Card className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-50/50 to-white dark:from-slate-800/80 dark:to-slate-900 shadow-purple-500/5">
                                    <CircularProgress
                                        value={resume.ats_score}
                                        size={140}
                                        strokeWidth={12}
                                        label="ATS Match"
                                        color="secondary"
                                    />
                                    <p className="mt-4 text-sm font-bold text-secondary-500">
                                        Parser Compatibility
                                    </p>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Middle Row: Skills Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div variants={fadeUpVariants}>
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <h3 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
                                                <CheckBadgeIcon className="h-6 w-6 mr-2 text-primary-500" />
                                                Verified Skills Matrix
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {data.skills_detected?.map((skill, i) => (
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    key={i}
                                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm"
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="text-sm font-bold text-red-500 flex items-center mb-3">
                                                <ExclamationCircleIcon className="w-4 h-4 mr-1" /> Critical Missing Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {data.missing_skills?.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={fadeUpVariants}>
                                <Card className="h-full">
                                    <CardContent className="p-6 h-full flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Skill Gap Analysis</h3>
                                        <p className="text-xs text-slate-500 mb-4">Visual representation of current vs required competencies</p>
                                        <div className="flex-1 min-h-[300px] flex items-center justify-center -ml-4">
                                            <SkillsRadarChart
                                                skills={data.skills_detected || []}
                                                missingSkills={data.missing_skills || []}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Bottom Row: Improvement Timeline */}
                        <motion.div variants={fadeUpVariants}>
                            <Card className="overflow-hidden border-t-4 border-t-yellow-400">
                                <CardContent className="p-0">
                                    <div className="bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-slate-900 p-8 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="text-2xl font-black flex items-center text-slate-800 dark:text-white">
                                            <LightBulbIcon className="h-8 w-8 mr-3 text-yellow-500" />
                                            Actionable Growth Roadmap
                                        </h3>
                                        <p className="text-slate-500 mt-2 max-w-2xl">Follow these prioritized AI suggestions to increase your interview callback rate.</p>
                                    </div>

                                    <div className="p-8">
                                        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-10 py-2">
                                            {data.improvement_suggestions?.map((sug, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1 }}
                                                    key={i}
                                                    className="relative pl-8"
                                                >
                                                    <span className="absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-white dark:bg-slate-900 border-4 border-yellow-400 flex items-center justify-center text-slate-800 dark:text-white text-xs font-black shadow-lg shadow-yellow-500/20">
                                                        {i + 1}
                                                    </span>
                                                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{sug}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'job-match' && (
                    <motion.div
                        key="job-match"
                        variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 gap-6"
                    >
                        <motion.div variants={fadeUpVariants} className="w-full">
                            <Card className="bg-gradient-to-r from-secondary-900 to-indigo-900 text-white border-none shadow-xl">
                                <CardContent className="p-8">
                                    <div className="max-w-3xl">
                                        <h2 className="text-3xl font-black mb-4 flex items-center">
                                            <BriefcaseIcon className="w-8 h-8 mr-3 text-secondary-400" />
                                            Target Role Alignment
                                        </h2>
                                        <p className="text-indigo-200 text-lg">
                                            Measure how well your resume matches a specific job description before you apply. Our AI engine compares semantics, skills, and experience constraints.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeUpVariants} className="max-w-4xl mx-auto w-full">
                            <JobMatcher resumeId={id} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResumeDetail;
