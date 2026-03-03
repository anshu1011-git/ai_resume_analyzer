import fitz  # PyMuPDF

class ExtractionService:
    @staticmethod
    def extract_text_from_pdf(pdf_content: bytes) -> str:
        """
        Extracts text from PDF content using PyMuPDF.
        """
        try:
            doc = fitz.open(stream=pdf_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
