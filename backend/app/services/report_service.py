from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

class ReportService:
    @staticmethod
    def generate_resume_report(resume_data: dict) -> bytes:
        """
        Generates a PDF report from resume analysis data.
        """
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, height - 50, f"Resulyze AI Analysis: {resume_data['original_filename']}")
        
        p.setFont("Helvetica", 12)
        p.drawString(100, height - 80, f"Overall Score: {resume_data['overall_score']}/100")
        p.drawString(100, height - 100, f"ATS Compatibility Score: {resume_data['ats_score']}/100")

        # Sections
        y = height - 140
        
        def write_section(title, items):
            nonlocal y
            p.setFont("Helvetica-Bold", 12)
            p.drawString(100, y, title)
            y -= 20
            p.setFont("Helvetica", 10)
            for item in items:
                p.drawString(120, y, f"• {item}")
                y -= 15
                if y < 50:
                    p.showPage()
                    y = height - 50
            y -= 10

        ai_json = resume_data.get("ai_response_json", {})
        
        write_section("Detected Skills", ai_json.get("skills_detected", []))
        write_section("Missing Skills", ai_json.get("missing_skills", []))
        write_section("Improvement Suggestions", ai_json.get("improvement_suggestions", []))
        write_section("Recommended Roles", ai_json.get("recommended_roles", []))
        
        p.setFont("Helvetica-Bold", 12)
        p.drawString(100, y, "Grammar Feedback")
        y -= 20
        p.setFont("Helvetica", 10)
        p.drawString(120, y, ai_json.get("grammar_feedback", "N/A"))

        p.showPage()
        p.save()
        
        pdf_content = buffer.getvalue()
        buffer.close()
        return pdf_content
