import { CVAnalysisData, ApplicationType } from '../contexts/CVAnalysisContext';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry'; // worker dimasukkan ke bundle

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = (content.items as { str: string }[]).map(item => item.str).join(' ');
    fullText += strings + '\n\n';
  }

  return fullText.trim();
};



// Mock function to simulate sending data to Gemini API for analysis

export const analyzeCVWithGemini = async (
  cvText: string,
  applicationType: ApplicationType,
  applicationName: string,
  applicationDescription: string
): Promise<Omit<CVAnalysisData, 'cvText' | 'fileName' | 'applicationInfo'>> => {
  console.log('GEMINI API KEY:', GEMINI_API_KEY);
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

console.log('PROMPT TO GEMINI ===>');
console.log(prompt);

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
