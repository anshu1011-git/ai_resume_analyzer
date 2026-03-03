import axios from 'axios';
import authService from './authService';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const resumeService = {
    uploadResume: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/resumes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getResumes: async () => {
        const response = await api.get('/resumes/');
        return response.data;
    },

    getResume: async (id) => {
        const response = await api.get(`/resumes/${id}`);
        return response.data;
    },

    deleteResume: async (id) => {
        const response = await api.delete(`/resumes/${id}`);
        return response.data;
    },

    downloadReport: async (id) => {
        const response = await api.get(`/resumes/${id}/report`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Resume_Report_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    matchJob: async (id, jobDescription) => {
        const response = await api.post(`/resumes/${id}/match`, {
            job_description: jobDescription
        });
        return response.data;
    }
};

export default resumeService;
