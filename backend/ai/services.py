"""
AI Service layer for OpenAI integration.
Uses a mock implementation when no valid API key is configured.
Swap to real OpenAI calls by providing a valid OPENAI_API_KEY in .env.
"""

import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Check if we have a real API key
_api_key = getattr(settings, 'OPENAI_API_KEY', '')
USE_MOCK = not _api_key or _api_key.startswith('sk-mock')

if not USE_MOCK:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=_api_key)
    except ImportError:
        logger.warning("OpenAI package not installed. Using mock responses.")
        USE_MOCK = True


class AIService:
    """
    Service class for AI-powered resume features.
    Falls back to intelligent mock responses when OpenAI is not configured.
    """

    # -------------------------------------------------------------------------
    # IMPROVE TEXT
    # -------------------------------------------------------------------------
    @staticmethod
    def improve_text(text: str, context: str = '') -> dict:
        """
        Improve a resume bullet point or paragraph.
        Returns the improved text with ATS-friendly language.
        """
        if USE_MOCK:
            return AIService._mock_improve(text)

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert resume writer and career coach. "
                            "Improve the given resume text to be more professional, "
                            "ATS-friendly, and impactful. Use strong action verbs, "
                            "quantify achievements where possible, and maintain a "
                            "concise, professional tone."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Context: {context}\n\nImprove this resume text:\n{text}"
                    }
                ],
                temperature=0.7,
                max_tokens=500,
            )
            improved = response.choices[0].message.content.strip()
            return {
                'original': text,
                'improved': improved,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"OpenAI improve_text error: {e}")
            return AIService._mock_improve(text)

    # -------------------------------------------------------------------------
    # ATS SCORE
    # -------------------------------------------------------------------------
    @staticmethod
    def get_ats_score(resume_data: dict) -> dict:
        """
        Analyze a resume for ATS compatibility.
        Returns a score (0-100) and actionable recommendations.
        """
        if USE_MOCK:
            return AIService._mock_ats_score(resume_data)

        try:
            resume_text = json.dumps(resume_data, indent=2)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an ATS (Applicant Tracking System) expert. "
                            "Analyze the given resume data and provide:\n"
                            "1. An ATS compatibility score from 0-100\n"
                            "2. A list of specific recommendations to improve the score\n"
                            "3. Keywords that should be added\n\n"
                            "Respond in JSON format with keys: score, recommendations (array), "
                            "missing_keywords (array), strengths (array)"
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this resume for ATS compatibility:\n{resume_text}"
                    }
                ],
                temperature=0.5,
                max_tokens=1000,
                response_format={"type": "json_object"},
            )
            result = json.loads(response.choices[0].message.content)
            result['status'] = 'success'
            return result
        except Exception as e:
            logger.error(f"OpenAI ats_score error: {e}")
            return AIService._mock_ats_score(resume_data)

    # -------------------------------------------------------------------------
    # GENERATE SUMMARY
    # -------------------------------------------------------------------------
    @staticmethod
    def generate_summary(resume_data: dict) -> dict:
        """
        Generate a professional summary paragraph based on resume data.
        """
        if USE_MOCK:
            return AIService._mock_summary(resume_data)

        try:
            resume_text = json.dumps(resume_data, indent=2)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert resume writer. Generate a compelling "
                            "professional summary (3-4 sentences) based on the resume data. "
                            "The summary should highlight key skills, experience level, "
                            "and career achievements. Make it ATS-friendly and impactful."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Generate a professional summary for this resume:\n{resume_text}"
                    }
                ],
                temperature=0.7,
                max_tokens=300,
            )
            summary = response.choices[0].message.content.strip()
            return {
                'summary': summary,
                'status': 'success'
            }
        except Exception as e:
            logger.error(f"OpenAI generate_summary error: {e}")
            return AIService._mock_summary(resume_data)

    # =========================================================================
    # MOCK RESPONSES (for development without OpenAI API key)
    # =========================================================================

    @staticmethod
    def _mock_improve(text: str) -> dict:
        """Generate a mock improvement that enhances the original text."""
        # Apply common resume improvement patterns
        improvements = {
            'managed': 'Spearheaded',
            'worked on': 'Engineered',
            'helped': 'Facilitated',
            'made': 'Developed',
            'did': 'Executed',
            'responsible for': 'Led',
            'used': 'Leveraged',
            'created': 'Architected',
            'improved': 'Optimized',
            'built': 'Designed and implemented',
        }

        improved = text
        for old, new in improvements.items():
            improved = improved.replace(old, new)
            improved = improved.replace(old.capitalize(), new)

        # Add quantification hint if not present
        if not any(char.isdigit() for char in improved):
            improved += ', resulting in measurable improvements in efficiency and productivity'

        return {
            'original': text,
            'improved': improved,
            'status': 'success',
            'mock': True,
        }

    @staticmethod
    def _mock_ats_score(resume_data: dict) -> dict:
        """Generate a mock ATS score based on resume completeness."""
        score = 45  # Base score

        # Score based on completeness
        if resume_data.get('summary'):
            score += 10
        if resume_data.get('skills') and len(resume_data['skills']) >= 5:
            score += 10
        if resume_data.get('experiences') and len(resume_data['experiences']) >= 2:
            score += 10
        if resume_data.get('educations') and len(resume_data['educations']) >= 1:
            score += 5
        if resume_data.get('full_name'):
            score += 5
        if resume_data.get('email'):
            score += 5
        if resume_data.get('phone'):
            score += 5
        if resume_data.get('linkedin'):
            score += 5

        return {
            'score': min(score, 100),
            'recommendations': [
                'Add more industry-specific keywords to your skills section',
                'Include quantifiable achievements in your experience descriptions',
                'Ensure your professional summary contains target job keywords',
                'Use standard section headings (Experience, Education, Skills)',
                'Add at least 8-12 relevant skills to pass ATS keyword filters',
            ],
            'missing_keywords': [
                'project management', 'cross-functional collaboration',
                'data-driven', 'stakeholder management', 'agile methodology'
            ],
            'strengths': [
                'Clean formatting detected',
                'Professional structure',
                'Contact information present',
            ],
            'status': 'success',
            'mock': True,
        }

    @staticmethod
    def _mock_summary(resume_data: dict) -> dict:
        """Generate a mock professional summary."""
        name = resume_data.get('full_name', 'Professional')
        skills = resume_data.get('skills', ['technology'])
        exp_count = len(resume_data.get('experiences', []))

        years = max(exp_count * 2, 1)
        skill_text = ', '.join(skills[:3]) if skills else 'modern technologies'

        summary = (
            f"Results-driven {name} with {years}+ years of experience in {skill_text}. "
            f"Proven track record of delivering high-impact solutions that drive business growth "
            f"and operational efficiency. Adept at collaborating with cross-functional teams "
            f"to transform complex requirements into scalable, production-ready systems. "
            f"Passionate about leveraging cutting-edge technologies to solve real-world challenges."
        )

        return {
            'summary': summary,
            'status': 'success',
            'mock': True,
        }
