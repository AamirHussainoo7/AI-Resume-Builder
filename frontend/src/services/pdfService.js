/**
 * PDF service — Handles PDF generation and download.
 */

import api from './api';

const pdfService = {
  generatePDF: async (resumeId, templateName = 'modern') => {
    const response = await api.post(
      '/pdf/generate/',
      { resume_id: resumeId, template_name: templateName },
      { responseType: 'blob' }
    );

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : 'resume.pdf';

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /** Client-side PDF generation using html2pdf.js */
  generateClientPDF: async (element, filename = 'resume.pdf') => {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    return html2pdf().set(opt).from(element).save();
  },
};

export default pdfService;
