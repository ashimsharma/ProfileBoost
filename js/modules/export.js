// Export Manager Module - PDF, DOCX, and Text export
export class ExportManager {
    constructor(previewManager) {
        this.previewManager = previewManager;
    }

    /**
     * Export resume as PDF
     * @param {Object} resumeData - Resume data
     * @returns {Promise<void>}
     */
    async exportToPDF(resumeData) {
        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF library not loaded');
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Get the preview HTML content
        const previewHTML = this.previewManager.getPreviewHTML();
        
        // For a production app, we would use html2canvas or similar
        // For now, we'll create a simple text-based PDF
        
        const fileName = this.generateFileName(resumeData, 'pdf');
        const pdfContent = this.convertToPDFContent(resumeData);
        
        // Add content to PDF
        let yPosition = 20;
        const lineHeight = 7;
        const pageHeight = 280;
        const margin = 20;
        const maxWidth = 170;

        pdfContent.forEach(item => {
            // Check if we need a new page
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(item.fontSize || 11);
            doc.setFont('helvetica', item.bold ? 'bold' : 'normal');
            
            // Handle multi-line text
            const lines = doc.splitTextToSize(item.text, maxWidth);
            lines.forEach(line => {
                if (yPosition > pageHeight - margin) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin, yPosition);
                yPosition += lineHeight;
            });

            if (item.spacing) {
                yPosition += item.spacing;
            }
        });

        // Save the PDF
        doc.save(fileName);
    }

    /**
     * Export resume as DOCX
     * @param {Object} resumeData - Resume data
     * @returns {Promise<void>}
     */
    async exportToDOCX(resumeData) {
        // Check if docx library is loaded
        if (typeof window.docx === 'undefined') {
            throw new Error('docx library not loaded');
        }

        const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;

        const fileName = this.generateFileName(resumeData, 'docx');
        
        // Create document sections
        const sections = [];

        // Header with name and contact
        sections.push(
            new Paragraph({
                text: resumeData.personal.fullName || 'Your Name',
                heading: HeadingLevel.HEADING_1,
                alignment: 'center'
            }),
            new Paragraph({
                children: [
                    new TextRun(`${resumeData.personal.email || ''} | ${resumeData.personal.phone || ''}`)
                ],
                alignment: 'center'
            }),
            new Paragraph({ text: '' }) // Empty line
        );

        // Professional Summary
        if (resumeData.summary) {
            sections.push(
                new Paragraph({
                    text: 'PROFESSIONAL SUMMARY',
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: resumeData.summary
                }),
                new Paragraph({ text: '' })
            );
        }

        // Work Experience
        if (resumeData.workExperience?.length) {
            sections.push(
                new Paragraph({
                    text: 'WORK EXPERIENCE',
                    heading: HeadingLevel.HEADING_2
                })
            );

            resumeData.workExperience.forEach(exp => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.title || 'Job Title', bold: true })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${exp.company || 'Company'} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`, italics: true })
                        ]
                    })
                );

                if (exp.achievements?.filter(a => a.trim()).length) {
                    exp.achievements.filter(a => a.trim()).forEach(achievement => {
                        sections.push(
                            new Paragraph({
                                text: `• ${achievement}`,
                                bullet: { level: 0 }
                            })
                        );
                    });
                }

                sections.push(new Paragraph({ text: '' }));
            });
        }

        // Education
        if (resumeData.education?.length) {
            sections.push(
                new Paragraph({
                    text: 'EDUCATION',
                    heading: HeadingLevel.HEADING_2
                })
            );

            resumeData.education.forEach(edu => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.degree || 'Degree'} in ${edu.major || 'Major'}`, bold: true })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.institution || 'Institution'} | ${edu.graduationDate || ''}`, italics: true })
                        ]
                    }),
                    new Paragraph({ text: '' })
                );
            });
        }

        // Skills
        if (resumeData.skills?.length) {
            sections.push(
                new Paragraph({
                    text: 'SKILLS',
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                    text: resumeData.skills.join(', ')
                }),
                new Paragraph({ text: '' })
            );
        }

        // Create document
        const doc = new Document({
            sections: [{
                properties: {},
                children: sections
            }]
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        this.downloadBlob(blob, fileName);
    }

    /**
     * Export resume as plain text
     * @param {Object} resumeData - Resume data
     * @returns {Promise<void>}
     */
    async exportToText(resumeData) {
        const fileName = this.generateFileName(resumeData, 'txt');
        let text = '';

        // Header
        text += `${resumeData.personal.fullName || 'Your Name'}\n`;
        text += `${resumeData.personal.email || ''} | ${resumeData.personal.phone || ''}\n`;
        if (resumeData.personal.linkedin) text += `${resumeData.personal.linkedin}\n`;
        if (resumeData.personal.portfolio) text += `${resumeData.personal.portfolio}\n`;
        text += '\n' + '='.repeat(60) + '\n\n';

        // Professional Summary
        if (resumeData.summary) {
            text += 'PROFESSIONAL SUMMARY\n';
            text += '-'.repeat(60) + '\n';
            text += `${resumeData.summary}\n\n`;
        }

        // Work Experience
        if (resumeData.workExperience?.length) {
            text += 'WORK EXPERIENCE\n';
            text += '-'.repeat(60) + '\n';
            resumeData.workExperience.forEach(exp => {
                text += `\n${exp.title || 'Job Title'}\n`;
                text += `${exp.company || 'Company'}`;
                if (exp.location) text += ` - ${exp.location}`;
                text += `\n${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}\n\n`;
                
                if (exp.achievements?.filter(a => a.trim()).length) {
                    exp.achievements.filter(a => a.trim()).forEach(achievement => {
                        text += `• ${achievement}\n`;
                    });
                    text += '\n';
                }
            });
        }

        // Education
        if (resumeData.education?.length) {
            text += 'EDUCATION\n';
            text += '-'.repeat(60) + '\n';
            resumeData.education.forEach(edu => {
                text += `\n${edu.degree || 'Degree'}`;
                if (edu.major) text += ` in ${edu.major}`;
                text += `\n${edu.institution || 'Institution'}`;
                if (edu.location) text += ` - ${edu.location}`;
                text += `\n${edu.graduationDate || ''}\n`;
                if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
                text += '\n';
            });
        }

        // Skills
        if (resumeData.skills?.length) {
            text += 'SKILLS\n';
            text += '-'.repeat(60) + '\n';
            text += `${resumeData.skills.join(' • ')}\n\n`;
        }

        // Projects
        if (resumeData.projects?.length) {
            text += 'PROJECTS\n';
            text += '-'.repeat(60) + '\n';
            resumeData.projects.forEach(proj => {
                text += `\n${proj.title || 'Project Title'}\n`;
                if (proj.description) text += `${proj.description}\n`;
                if (proj.technologies) text += `Technologies: ${proj.technologies}\n`;
                if (proj.githubUrl) text += `GitHub: ${proj.githubUrl}\n`;
                if (proj.demoUrl) text += `Demo: ${proj.demoUrl}\n`;
                text += '\n';
            });
        }

        // Certifications
        if (resumeData.certifications?.length) {
            text += 'CERTIFICATIONS & AWARDS\n';
            text += '-'.repeat(60) + '\n';
            resumeData.certifications.forEach(cert => {
                text += `\n${cert.name || 'Certification'} - ${cert.issuer || ''}\n`;
                if (cert.date) text += `${cert.date}\n`;
                if (cert.url) text += `${cert.url}\n`;
            });
            text += '\n';
        }

        // Languages
        if (resumeData.languages?.length) {
            text += 'LANGUAGES\n';
            text += '-'.repeat(60) + '\n';
            resumeData.languages.forEach(lang => {
                text += `${lang.language || 'Language'}: ${this.formatProficiency(lang.proficiency)}\n`;
            });
        }

        // Create and download
        const blob = new Blob([text], { type: 'text/plain' });
        this.downloadBlob(blob, fileName);
    }

    convertToPDFContent(resumeData) {
        const content = [];

        // Header
        content.push({
            text: resumeData.personal.fullName || 'Your Name',
            fontSize: 20,
            bold: true,
            spacing: 3
        });

        const contactInfo = [
            resumeData.personal.email,
            resumeData.personal.phone,
            resumeData.personal.linkedin,
            resumeData.personal.portfolio
        ].filter(Boolean).join(' | ');

        content.push({
            text: contactInfo,
            fontSize: 10,
            spacing: 5
        });

        // Professional Summary
        if (resumeData.summary) {
            content.push({
                text: 'PROFESSIONAL SUMMARY',
                fontSize: 14,
                bold: true,
                spacing: 2
            });
            content.push({
                text: resumeData.summary,
                fontSize: 11,
                spacing: 5
            });
        }

        // Work Experience
        if (resumeData.workExperience?.length) {
            content.push({
                text: 'WORK EXPERIENCE',
                fontSize: 14,
                bold: true,
                spacing: 2
            });

            resumeData.workExperience.forEach(exp => {
                content.push({
                    text: exp.title || 'Job Title',
                    fontSize: 12,
                    bold: true,
                    spacing: 1
                });
                content.push({
                    text: `${exp.company || 'Company'} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`,
                    fontSize: 10,
                    spacing: 1
                });

                if (exp.achievements?.filter(a => a.trim()).length) {
                    exp.achievements.filter(a => a.trim()).forEach(achievement => {
                        content.push({
                            text: `• ${achievement}`,
                            fontSize: 10,
                            spacing: 1
                        });
                    });
                }

                content.push({ text: '', spacing: 3 });
            });
        }

        // Education, Skills, etc. would be added similarly...

        return content;
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    generateFileName(resumeData, extension) {
        const name = resumeData.personal.fullName || 'Resume';
        const date = new Date().toISOString().split('T')[0];
        return `${name.replace(/\s+/g, '_')}_${date}.${extension}`;
    }

    formatProficiency(level) {
        const proficiencyMap = {
            native: 'Native',
            fluent: 'Fluent',
            advanced: 'Advanced',
            intermediate: 'Intermediate',
            basic: 'Basic'
        };
        return proficiencyMap[level] || level;
    }
}
