import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MOCK_AI = os.getenv("MOCK_AI", "false").lower() == "true"

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

class AIService:
    @staticmethod
    async def analyze_resume(resume_text: str):
        """
        Sends resume text to OpenAI for analysis.
        """
        system_prompt = (
            "You are an expert HR recruiter and ATS system analyzer. "
            "Analyze the following resume and return JSON response in this format: "
            "{"
            "  \"overall_score\": number, "
            "  \"ats_score\": number, "
            "  \"skills_detected\": [], "
            "  \"missing_skills\": [], "
            "  \"improvement_suggestions\": [], "
            "  \"grammar_feedback\": \"\", "
            "  \"recommended_roles\": [] "
            "}"
            "Be precise and structured. Return only JSON."
        )

        if MOCK_AI or not client:
            return {
                "overall_score": 85,
                "ats_score": 78,
                "skills_detected": ["Python", "FastAPI", "React", "Docker", "REST APIs"],
                "missing_skills": ["Kubernetes", "Redis", "Unit Testing"],
                "improvement_suggestions": [
                    "Add more detail to your experience sections.",
                    "Include a professional summary at the top.",
                    "Quantify your achievements with numbers (e.g., 'Improved performance by 20%')."
                ],
                "grammar_feedback": "Resume is well-written with minor formatting improvements needed.",
                "recommended_roles": ["Full Stack Developer", "Backend Engineer", "Software Engineer"]
            }

        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analyze this resume content:\n\n{resume_text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            result = response.choices[0].message.content
            return json.loads(result)
        except Exception as e:
            raise Exception(f"AI analysis failed: {str(e)}")
    @staticmethod
    async def match_job(resume_text: str, job_description: str):
        """
        Matches resume text against a specific job description.
        """
        system_prompt = (
            "You are an expert HR recruiter and ATS optimizer. "
            "Compare the provided resume against the job description. "
            "Evaluate the match based on skills, experience, and educational requirements. "
            "Return a JSON response in this format: "
            "{"
            "  \"score\": number (0-100), "
            "  \"level\": \"Excellent Match\" | \"Good Match\" | \"Fair Match\" | \"Poor Match\", "
            "  \"matching_key\": [\"list of skills that match\"], "
            "  \"missing_required\": [\"list of critical requirements missing\"], "
            "  \"reasoning\": \"brief explanation of the score\" "
            "}"
            "Return only JSON."
        )

        if MOCK_AI or not client:
            return {
                "score": 75,
                "level": "Good Match",
                "matching_key": ["Python", "React", "Docker"],
                "missing_required": ["Kubernetes", "Redis", "Cloud Architecture"],
                "reasoning": "The candidate has strong technical skills but lacks direct experience with cloud-native infrastructure requested."
            }

        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"}
                ],
                response_format={"type": "json_object"}
            )
            
            result = response.choices[0].message.content
            return json.loads(result)
        except Exception as e:
            raise Exception(f"AI job matching failed: {str(e)}")
