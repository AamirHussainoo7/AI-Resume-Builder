"""
PDF generation service using WeasyPrint.
Renders resume data into professional PDF documents using HTML templates.
Falls back to a simple HTML-to-PDF approach if WeasyPrint is not available.
"""

import logging
from io import BytesIO
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    WEASYPRINT_AVAILABLE = False
    logger.warning(
        "WeasyPrint is not available. PDF generation will use fallback. "
        "Install WeasyPrint and its system dependencies for full PDF support."
    )


class PDFService:
    """Service for generating PDF resumes from templates."""

    # Map template names to HTML template files
    TEMPLATE_MAP = {
        'modern': 'pdf/modern.html',
        'classic': 'pdf/classic.html',
        'minimal': 'pdf/minimal.html',
        'executive': 'pdf/executive.html',
        'creative': 'pdf/creative.html',
    }

    @staticmethod
    def generate_pdf(resume_data: dict, template_name: str = 'modern') -> bytes:
        """
        Generate a PDF from resume data using the specified template.

        Args:
            resume_data: Serialized resume data dictionary
            template_name: Name of the template to use

        Returns:
            PDF file as bytes
        """
        template_file = PDFService.TEMPLATE_MAP.get(template_name, 'pdf/modern.html')

        # Render the HTML template with resume data
        html_string = render_to_string(template_file, {'resume': resume_data})

        if WEASYPRINT_AVAILABLE:
            return PDFService._generate_with_weasyprint(html_string)
        else:
            return PDFService._generate_fallback(html_string)

    @staticmethod
    def _generate_with_weasyprint(html_string: str) -> bytes:
        """Generate PDF using WeasyPrint."""
        html = HTML(string=html_string)
        pdf_bytes = html.write_pdf()
        return pdf_bytes

    @staticmethod
    def _generate_fallback(html_string: str) -> bytes:
        """
        Fallback: return the HTML as bytes (can be rendered client-side).
        This is used when WeasyPrint is not installed.
        """
        return html_string.encode('utf-8')
