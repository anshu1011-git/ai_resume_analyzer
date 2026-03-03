import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
    CloudArrowUpIcon,
    DocumentIcon,
    CheckCircleIcon,
    ChartBarIcon,
    TrashIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import resumeService from '../services/resumeService';
import authService from '../services/authService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ScoreTrendChart } from '../components/charts/ScoreTrendChart';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchResumes();
    }, [navigate]);

    const fetchResumes = async () => {
        try {
            const data = await resumeService.getResumes();
            setResumes(data);
        } catch (err) {
            toast.error('Failed to fetch resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are supported');
            return;
        }

        setUploading(true);
        const toastId = toast.loading('AI is analyzing your resume...');

        try {
            const result = await resumeService.uploadResume(file);
            toast.update(toastId, { render: 'Analysis complete!', type: 'success', isLoading: false, autoClose: 3000 });
            navigate(`/resume/${result.id}`);
        } catch (err) {
            toast.update(toastId, { render: err.response?.data?.detail || 'Analysis failed', type: 'error', isLoading: false, autoClose: 3000 });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this analysis?')) return;

        try {
            await resumeService.deleteResume(id);
            setResumes(resumes.filter(r => r.id !== id));
            toast.success('Deleted successfully');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const avgScore = resumes.length > 0
        ? Math.round(resumes.reduce((acc, curr) => acc + curr.overall_score, 0) / resumes.length)
        : 0;

    const atsReadyCount = resumes.filter(r => r.ats_score > 70).length;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Grid: Upload & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Upload Section */}
                <Card className="lg:col-span-2 border-dashed border-2 border-slate-300 dark:border-slate-600 hover:border-primary-500">
                    <label className="flex flex-col items-center justify-center w-full h-full min-h-[200px] cursor-pointer">
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl mb-4">
                                <CloudArrowUpIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                            </div>
                            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                Click to upload <span className="text-slate-500 dark:text-slate-400 font-normal">or drag and drop</span>
                            </p>
                            <p className="text-sm text-slate-400">PDF Resumes Only (Max. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={uploading} />

                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-xl">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <p className="text-primary-600 dark:text-primary-400 font-medium">AI is analyzing...</p>
                                </div>
                            </div>
                        )}
                    </label>
                </Card>

                {/* Score Trend Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center text-primary-600 dark:text-primary-400">
                            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                            <CardTitle className="text-lg">Score Trend</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-48 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                        ) : (
                            <ScoreTrendChart data={resumes} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Resumes</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{resumes.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <DocumentIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Avg. Score</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">
                                {avgScore}<span className="text-lg text-slate-400">%</span>
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <CheckCircleIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ATS Ready</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white">{atsReadyCount}</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <ChartBarIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Analysis List */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white flex items-center">
                    <DocumentIcon className="w-5 h-5 mr-2 text-primary-500" />
                    Recent Analyses
                </h3>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <Card className="border-dashed border-2 py-8 flex flex-col items-center justify-center">
                        <DocumentIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-slate-600 dark:text-slate-400 font-medium">No resumes uploaded yet.</p>
                        <p className="text-sm text-slate-400">Upload a PDF resume to get started</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {resumes.map((resume) => (
                            <Card
                                key={resume.id}
                                className="cursor-pointer hover:border-primary-400 transition-colors"
                                onClick={() => navigate(`/resume/${resume.id}`)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-4">
                                            <DocumentIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800 dark:text-white">
                                                {resume.original_filename}
                                            </h4>
                                            <p className="text-sm text-slate-500">
                                                Analyzed on {new Date(resume.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 uppercase font-medium mb-1">Score</p>
                                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${resume.overall_score > 70 ? 'bg-green-600' :
                                                    resume.overall_score > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}>
                                                {resume.overall_score}%
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(e, resume.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
