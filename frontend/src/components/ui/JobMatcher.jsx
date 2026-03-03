import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import resumeService from '../../services/resumeService';


export const JobMatcher = ({ resumeId }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [matchResult, setMatchResult] = useState(null);

    const handleMatch = async () => {
        if (!jobDescription.trim()) return;

        setIsAnalyzing(true);
        try {
            const result = await resumeService.matchJob(resumeId, jobDescription);
            setMatchResult({
                score: result.score,
                level: result.level,
                missingRequired: result.missing_required,
                matchingKey: result.matching_key,
                reasoning: result.reasoning
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Card className="shadow-secondary-500/5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center text-secondary-500 mb-4">
                    <BriefcaseIcon className="w-6 h-6 mr-2" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">Job Compatibility Match</h3>
                </div>

                {!matchResult ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Paste a job description below to see how well this resume matches the requirements.
                        </p>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste job description here..."
                            className="w-full h-32 p-4 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-secondary-500 focus:outline-none resize-none transition-shadow text-sm"
                        />
                        <Button
                            variant="secondary"
                            className="w-full bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-500 hover:to-primary-500 border-none relative overflow-hidden group"
                            onClick={handleMatch}
                            disabled={!jobDescription.trim() || isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center">
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></span>
                                    AI Analyzing Compatibility...
                                </span>
                            ) : 'Analyze Match'}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Compatibility Level</p>
                                <p className={`text-2xl font-black ${matchResult.score > 80 ? 'text-green-500' :
                                    matchResult.score > 60 ? 'text-yellow-500' : 'text-red-500'
                                    }`}>
                                    {matchResult.level}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-black bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                    {matchResult.score}%
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-green-500 flex items-center">
                                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                                    Matching Skills
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {matchResult.matchingKey.map(s => (
                                        <span key={s} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-red-500 flex items-center">
                                    <XCircleIcon className="w-4 h-4 mr-1" />
                                    Missing Required
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {matchResult.missingRequired.map(s => (
                                        <span key={s} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                                setMatchResult(null);
                                setJobDescription('');
                            }}
                        >
                            Test Another Job Description
                        </Button>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
};
