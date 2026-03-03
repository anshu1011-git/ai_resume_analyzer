import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

export const SkillsRadarChart = ({ skills, missingSkills }) => {
    // Transformer helper to give arbitrary scores to skills for visualization
    const chartData = [
        ...skills.map(s => ({ subject: s, A: Math.floor(Math.random() * 20) + 80, fill: '#6366f1' })), // 80-100 for possessed skills
        ...missingSkills.map(s => ({ subject: s, A: Math.floor(Math.random() * 30) + 10, fill: '#ef4444' })) // 10-40 for missing
    ].slice(0, 8); // Limit to 8 axes for clean visualization

    if (chartData.length === 0) return null;

    return (
        <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(148,163,184,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            color: '#fff',
                        }}
                    />
                    <Radar
                        name="Skill Proficiency"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.4}
                        animationDuration={2000}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
