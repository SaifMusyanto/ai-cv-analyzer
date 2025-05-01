import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVAnalysis } from '../contexts/CVAnalysisContext';
import { Upload, AlertTriangle } from 'lucide-react';
import { ApplicationType } from '../contexts/CVAnalysisContext';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { extractTextFromPDF, analyzeCVWithGemini } from '../services/api';

const AnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAnalysisData, setIsAnalyzing, getRemainingAnalyses, decrementRemainingAnalyses } = useCVAnalysis();
  
  const [file, setFile] = useState<File | null>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType>('job');
  const [applicationName, setApplicationName] = useState('');
  const [applicationDescription, setApplicationDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const remainingAnalyses = getRemainingAnalyses();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload your CV (PDF format)');
      return;
    }
    
    if (!applicationName.trim()) {
      setError('Please enter the application name');
      return;
    }
    
    if (!applicationDescription.trim()) {
      setError('Please describe the application briefly');
      return;
    }
    
    if (remainingAnalyses <= 0) {
      setError('You have reached your monthly limit of CV analyses');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsAnalyzing(true);
      
      // Step 1: Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Step 2: Analyze the CV with Gemini
      const analysisResult = await analyzeCVWithGemini(
        extractedText,
        applicationType,
        applicationName,
        applicationDescription
      );
      
      // Step 3: Combine all data and save to context
      setAnalysisData({
        applicationInfo: {
          type: applicationType,
          name: applicationName,
          description: applicationDescription,
        },
        cvText: extractedText,
        fileName: file.name,
        scores: analysisResult.scores,
        suggestions: analysisResult.suggestions,
      });
      
      // Step 4: Decrement the remaining analyses
      decrementRemainingAnalyses();
      
      // Step 5: Navigate to results page
      navigate('/results');
    } catch (err) {
      console.error('Error analyzing CV:', err);
      setError('An error occurred while analyzing your CV. Please try again.');
    } finally {
      setLoading(false);
      setIsAnalyzing(false); // <- pindah ke sini
    }

  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">CV Analyzer</h1>
        <p className="text-lg text-gray-600">
          Upload your CV and application details to get AI-powered feedback and suggestions.
        </p>
      </div>
      
      {remainingAnalyses <= 0 && (
        <div className="mb-6 bg-amber-100 border border-amber-300 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Monthly limit reached</h3>
            <p className="text-sm text-amber-700">
              You have used all your free analyses this month. Sign up for a premium account to continue analyzing CVs.
            </p>
          </div>
        </div>
      )}
      
      {remainingAnalyses > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            You have <span className="font-semibold">{remainingAnalyses}</span> CV analyses remaining this month.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Type
              </label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="job">Job Application</option>
                <option value="scholarship">Scholarship</option>
                <option value="organization">Organization</option>
                <option value="volunteer">Volunteer Position</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Name
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder={`e.g., ${
                  applicationType === 'job' 
                    ? 'Software Developer at Google' 
                    : applicationType === 'scholarship'
                    ? 'MIT Computer Science Scholarship'
                    : applicationType === 'organization'
                    ? 'Google Developer Student Club'
                    : 'Volunteer Web Developer at Red Cross'
                }`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={applicationDescription}
                onChange={(e) => setApplicationDescription(e.target.value)}
                rows={4}
                placeholder={`Briefly describe the ${
                  applicationType === 'job' 
                    ? 'job requirements and responsibilities' 
                    : applicationType === 'scholarship'
                    ? 'scholarship criteria and requirements'
                    : applicationType === 'organization'
                    ? 'organization and membership requirements'
                    : 'volunteer position and requirements'
                }`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Your CV
              </label>
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                disabled={loading || remainingAnalyses <= 0}
                leftIcon={<Upload className="h-5 w-5" />}
              >
                {loading ? 'Analyzing...' : 'Analyze My CV'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalyzerPage;