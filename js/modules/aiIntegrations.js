// AI Integrations Module - Chrome Built-in AI APIs
export class AIIntegrations {
    constructor() {
        this.capabilities = {
            prompt: false,
            writer: false,
            rewriter: false,
            summarizer: false,
            translator: false,
            proofreader: false
        };
        this.checkCapabilities();
    }

    async checkCapabilities() {
        try {
            this.capabilities.prompt = window.ai && typeof window.ai.createTextSession === 'function';
            this.capabilities.writer = window.ai && typeof window.ai.writer === 'object';
            this.capabilities.rewriter = window.ai && typeof window.ai.rewriter === 'object';
            this.capabilities.summarizer = window.ai && typeof window.ai.summarizer === 'object';
            this.capabilities.translator = window.ai && typeof window.ai.translator === 'object';
            this.capabilities.proofreader = window.ai && typeof window.ai.proofreader === 'object';
        } catch (error) {
            console.error('Error checking AI capabilities:', error);
        }
        return this.capabilities;
    }

    /**
     * Generate tailored professional summary using Prompt API
     * @param {string} resumeText - Current resume content
     * @param {string} jobDescription - Target job description
     * @returns {Promise<string>} - Generated summary
     */
    async generateSummary(resumeText, jobDescription) {
        if (!this.capabilities.prompt) {
            return this.fallbackGenerateSummary(resumeText, jobDescription);
        }

        try {
            const session = await window.ai.createTextSession();
            const prompt = `Based on this resume and job description, write a compelling professional summary (3-4 sentences):

Resume:
${resumeText}

Job Description:
${jobDescription}

Professional Summary:`;

            const result = await session.prompt(prompt);
            return result;
        } catch (error) {
            console.error('Error generating summary:', error);
            return this.fallbackGenerateSummary(resumeText, jobDescription);
        }
    }

    /**
     * Fix grammar, punctuation, and spelling using Proofreader API
     * @param {string} text - Text to proofread
     * @returns {Promise<string>} - Proofread text
     */
    async proofread(text) {
        if (!this.capabilities.proofreader) {
            return this.fallbackProofread(text);
        }

        try {
            // TODO: Implement actual Proofreader API when available
            // const session = await window.ai.proofreader.create();
            // const result = await session.proofread(text);
            // return result;
            
            return this.fallbackProofread(text);
        } catch (error) {
            console.error('Error proofreading:', error);
            return this.fallbackProofread(text);
        }
    }

    /**
     * Enhance weak phrases and improve action verb usage using Rewriter API
     * @param {string} text - Text to rewrite
     * @param {string} context - Context for rewriting (e.g., 'professional', 'technical')
     * @returns {Promise<string>} - Rewritten text
     */
    async rewrite(text, context = 'professional') {
        if (!this.capabilities.rewriter) {
            return this.fallbackRewrite(text, context);
        }

        try {
            // TODO: Implement actual Rewriter API when available
            // const session = await window.ai.rewriter.create({ tone: context });
            // const result = await session.rewrite(text);
            // return result;
            
            return this.fallbackRewrite(text, context);
        } catch (error) {
            console.error('Error rewriting:', error);
            return this.fallbackRewrite(text, context);
        }
    }

    /**
     * Condense lengthy descriptions using Summarizer API
     * @param {string} text - Text to summarize
     * @param {number} maxLength - Maximum length of summary
     * @returns {Promise<string>} - Summarized text
     */
    async summarize(text, maxLength = 200) {
        if (!this.capabilities.summarizer) {
            return this.fallbackSummarize(text, maxLength);
        }

        try {
            // TODO: Implement actual Summarizer API when available
            // const session = await window.ai.summarizer.create({ maxLength });
            // const result = await session.summarize(text);
            // return result;
            
            return this.fallbackSummarize(text, maxLength);
        } catch (error) {
            console.error('Error summarizing:', error);
            return this.fallbackSummarize(text, maxLength);
        }
    }

    /**
     * Translate resume content using Translator API
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @returns {Promise<string>} - Translated text
     */
    async translate(text, targetLang) {
        if (!this.capabilities.translator) {
            return this.fallbackTranslate(text, targetLang);
        }

        try {
            // TODO: Implement actual Translator API when available
            // const session = await window.ai.translator.create({ targetLanguage: targetLang });
            // const result = await session.translate(text);
            // return result;
            
            return this.fallbackTranslate(text, targetLang);
        } catch (error) {
            console.error('Error translating:', error);
            return this.fallbackTranslate(text, targetLang);
        }
    }

    /**
     * Generate content using Writer API
     * @param {string} prompt - Writing prompt
     * @param {string} context - Context for writing
     * @returns {Promise<string>} - Generated content
     */
    async write(prompt, context = '') {
        if (!this.capabilities.writer) {
            return this.fallbackWrite(prompt, context);
        }

        try {
            // TODO: Implement actual Writer API when available
            // const session = await window.ai.writer.create();
            // const result = await session.write(prompt, { context });
            // return result;
            
            return this.fallbackWrite(prompt, context);
        } catch (error) {
            console.error('Error writing:', error);
            return this.fallbackWrite(prompt, context);
        }
    }

    /**
     * Optimize resume for job description using Prompt API
     * @param {string} resumeText - Original resume
     * @param {string} jobDescription - Job description
     * @returns {Promise<Object>} - Optimization results
     */
    async optimizeForJob(resumeText, jobDescription) {
        if (!this.capabilities.prompt) {
            return this.fallbackOptimize(resumeText, jobDescription);
        }

        try {
            const session = await window.ai.createTextSession();
            
            // Extract keywords from job description
            const keywordsPrompt = `Extract the top 10 most important keywords and skills from this job description. List them as comma-separated values:

${jobDescription}

Keywords:`;
            
            const keywordsResult = await session.prompt(keywordsPrompt);
            const jobKeywords = keywordsResult.split(',').map(k => k.trim());
            
            // Analyze resume for keyword match
            const resumeLower = resumeText.toLowerCase();
            const matchedKeywords = jobKeywords.filter(keyword => 
                resumeLower.includes(keyword.toLowerCase())
            );
            const missingKeywords = jobKeywords.filter(keyword => 
                !resumeLower.includes(keyword.toLowerCase())
            );
            
            const matchScore = Math.round((matchedKeywords.length / jobKeywords.length) * 100);
            
            // Generate suggestions
            const suggestionsPrompt = `Based on this resume and job description, provide 5 specific suggestions to improve the resume. Be concise and actionable:

Resume:
${resumeText.substring(0, 1000)}

Job Description:
${jobDescription.substring(0, 500)}

Suggestions:`;
            
            const suggestionsResult = await session.prompt(suggestionsPrompt);
            const suggestions = suggestionsResult.split('\n').filter(s => s.trim()).slice(0, 5);
            
            return {
                matchScore,
                atsScore: this.calculateATSScore(resumeText),
                missingKeywords,
                matchedKeywords,
                suggestions,
                optimizedText: resumeText // Placeholder for actual optimization
            };
        } catch (error) {
            console.error('Error optimizing resume:', error);
            return this.fallbackOptimize(resumeText, jobDescription);
        }
    }

    calculateATSScore(resumeText) {
        let score = 100;
        
        // Check for common ATS-unfriendly elements
        if (resumeText.includes('<table>') || resumeText.includes('table')) score -= 10;
        if (resumeText.includes('image') || resumeText.includes('<img')) score -= 15;
        if (resumeText.length < 500) score -= 20;
        if (resumeText.length > 5000) score -= 10;
        
        // Check for good elements
        if (resumeText.match(/\d+%|\d+\s*(years?|months?)/gi)) score += 5;
        if (resumeText.match(/\$\d+|\d+k/gi)) score += 5;
        
        return Math.max(0, Math.min(100, score));
    }

    // Fallback methods when AI APIs are not available
    fallbackGenerateSummary(resumeText, jobDescription) {
        return "Experienced professional with a strong background in the field. Skilled at delivering results and working collaboratively with teams. Seeking to leverage expertise in a challenging new role.";
    }

    fallbackProofread(text) {
        // Basic text cleanup
        return text
            .replace(/\s+/g, ' ')
            .replace(/\s+([.,;:!?])/g, '$1')
            .trim();
    }

    fallbackRewrite(text, context) {
        // Simple enhancement by ensuring action verbs
        const actionVerbs = ['Led', 'Developed', 'Implemented', 'Managed', 'Created', 'Designed', 'Improved'];
        return text; // Return as-is for fallback
    }

    fallbackSummarize(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    fallbackTranslate(text, targetLang) {
        return text; // Cannot translate without API
    }

    fallbackWrite(prompt, context) {
        return "• Accomplished professional with demonstrated expertise\n• Strong communication and problem-solving skills\n• Proven track record of delivering high-quality results";
    }

    fallbackOptimize(resumeText, jobDescription) {
        // Basic keyword extraction from job description
        const words = jobDescription.toLowerCase().split(/\W+/);
        const wordFreq = {};
        words.forEach(word => {
            if (word.length > 4) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        const topKeywords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
        
        const resumeLower = resumeText.toLowerCase();
        const missingKeywords = topKeywords.filter(kw => !resumeLower.includes(kw));
        const matchedKeywords = topKeywords.filter(kw => resumeLower.includes(kw));
        
        return {
            matchScore: Math.round((matchedKeywords.length / topKeywords.length) * 100),
            atsScore: this.calculateATSScore(resumeText),
            missingKeywords,
            matchedKeywords,
            suggestions: [
                'Add more quantifiable achievements with specific numbers and percentages',
                'Include relevant keywords from the job description',
                'Use strong action verbs at the beginning of bullet points',
                'Tailor your professional summary to match the role requirements',
                'Ensure consistent formatting and remove any graphics or tables'
            ],
            optimizedText: resumeText
        };
    }
}
