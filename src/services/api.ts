import { CVAnalysisData, ApplicationType } from '../contexts/CVAnalysisContext';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Mock function to simulate PDF text extraction
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real implementation, this would use PDF.co API or similar
  // For the MVP, we'll simulate the text extraction
  console.log('Extracting text from PDF:', file.name);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Sample extracted text from ${file.name}. 
        This is a professional CV for a software developer with 5 years of experience.
        Skills include React, TypeScript, Node.js, and cloud technologies.
        Education: BS in Computer Science, worked at multiple tech companies.`);
    }, 1500);
  });
};

// Mock function to simulate sending data to Gemini API for analysis
// export const analyzeCVWithGemini = async (
//   cvText: string,
//   applicationType: ApplicationType,
//   applicationName: string,
//   applicationDescription: string
// ): Promise<Omit<CVAnalysisData, 'cvText' | 'fileName' | 'applicationInfo'>> => {
//   // In a real implementation, this would call the Gemini API
//   console.log('Analyzing CV with Gemini:', { cvText, applicationType, applicationName, applicationDescription });
  
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         scores: {
//           overall: 74,
//           relevance: 70,
//           structure: 80,
//           writing: 75,
//           experience: 65,
//           professionalism: 80,
//         },
//         suggestions: [
//           {
//             section: 'Header',
//             issue: 'Contact information not prominent',
//             suggestion: 'Move your email and phone number to be more visible under your name',
//           },
//           {
//             section: 'Experience',
//             issue: 'Job descriptions lack quantifiable achievements',
//             suggestion: 'Add metrics and specific outcomes to your job descriptions',
//           },
//           {
//             section: 'Skills',
//             issue: 'Skills not aligned with job description',
//             suggestion: 'Emphasize skills mentioned in the job posting like cloud technologies',
//           },
//           {
//             section: 'Education',
//             issue: 'Education section lacks details',
//             suggestion: 'Add GPA, relevant coursework, and any academic achievements',
//           },
//           {
//             section: 'Overall',
//             issue: 'CV is too generic',
//             suggestion: 'Tailor your CV specifically to the role by highlighting relevant experiences',
//           },
//         ],
//       });
//     }, 2000);
//   });
// };

export const analyzeCVWithGemini = async (
  cvText: string,
  applicationType: ApplicationType,
  applicationName: string,
  applicationDescription: string
): Promise<Omit<CVAnalysisData, 'cvText' | 'fileName' | 'applicationInfo'>> => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
You are a CV analyzer AI. Analyze the following resume text for a ${applicationType} application.
The job/scholarship/organization is titled: "${applicationName}".
Description of the opportunity: "${applicationDescription}".

Evaluate the resume on the following aspects (score 0-100):
- Relevance
- Structure
- Writing
- Experience
- Professionalism

Return a JSON object with:
{
  "scores": {
    "overall": number,
    "relevance": number,
    "structure": number,
    "writing": number,
    "experience": number,
    "professionalism": number
  },
  "suggestions": [
    {
      "section": string,
      "issue": string,
      "suggestion": string
      "example": string (optional)
    },
    ...
  ]
}

Resume text:
${cvText}
`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
  const cleanText = extractJSONFromText(rawText);
  const parsed = JSON.parse(cleanText);
  return parsed;
} catch {
  console.error('Failed to extract/parse Gemini response:', rawText);
  throw new Error('Invalid response from Gemini');
}

};

const extractJSONFromText = (text: string): string => {
  // Hapus blok kode markdown jika ada
  const codeBlock = text.match(/```json([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();

  // Jika tidak ada markdown, cari objek JSON secara manual
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  throw new Error('No valid JSON found in Gemini response');
};




const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const buildCVWithAI = async (
  analysisData: CVAnalysisData,
  template: string
): Promise<string> => {
  const prompt = `
You are a professional CV writer. Based on the following analysis and target application, generate an improved CV using this template style: "${template}".

### Application Info:
Type: ${analysisData.applicationInfo.type}
Name: ${analysisData.applicationInfo.name}
Description: ${analysisData.applicationInfo.description}

### CV Extracted Text:
${analysisData.cvText}

### Suggestions from Analysis:
${analysisData.suggestions.join('\n')}

Generate the CV in Markdown format and wrap the result in triple backticks using "markdown".
`;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    const fullText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!fullText) {
      throw new Error('Gemini returned no text');
    }

    // Extract only the markdown block content
    const markdownMatch = fullText.match(/```markdown\s*([\s\S]*?)\s*```/i);
    const markdownCV = markdownMatch ? markdownMatch[1].trim() : fullText.trim();

    return markdownCV;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw new Error('Failed to generate CV. Please try again.');
  }
};
