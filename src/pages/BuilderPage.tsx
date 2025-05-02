import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVAnalysis } from '../contexts/CVAnalysisContext';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import CVTemplateSelector from '../components/CVTemplateSelector';
import { buildCVWithAI } from '../services/api';

const BuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisData, selectedTemplate } = useCVAnalysis();
  const [generatedCV, setGeneratedCV] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If no analysis data is available, prompt user to analyze CV first
  const noAnalysisData = !analysisData;
  
  
  const handleBuildCV = async () => {
    console.log('Analysis Data:', analysisData);
    console.log('Template:', selectedTemplate);
    if (!analysisData) {
      setError('Please analyze your CV first before building a new one');
      return;
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      

      
      const result = await buildCVWithAI(analysisData, selectedTemplate);
      setGeneratedCV(result);
    } catch (err) {
      console.error('Error building CV:', err);
      setError('An error occurred while building your CV. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadCV = () => {
    if (!generatedCV) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedCV], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `improved_cv_${selectedTemplate}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(analysisData ? '/results' : '/analyzer')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> 
          Back to {analysisData ? 'Results' : 'Analyzer'}
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">CV Builder</h1>
        <p className="text-lg text-gray-600">
          Create an optimized CV based on your analysis and feedback
        </p>
      </div>
      
      {noAnalysisData ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">No CV Analysis Found</h3>
          <p className="text-amber-700 mb-4">
            To build an improved CV, you need to analyze your current CV first.
          </p>
          <Button 
            onClick={() => navigate('/analyzer')}
            variant="outline"
          >
            Go to CV Analyzer
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <CVTemplateSelector />
          </div>
          
          {!generatedCV ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6 text-center">
              <div className="max-w-lg mx-auto">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to build your improved CV?</h3>
                <p className="text-gray-600 mb-6">
                  Our AI will generate an optimized version of your CV based on the analysis and your selected template.
                </p>
                <Button
                  onClick={handleBuildCV}
                  isLoading={isGenerating}
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? 'Generating...' : 'Build My CV'}
                </Button>
                {error && (
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Your Improved CV</h3>
                  <Button
                    onClick={handleDownloadCV}
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto max-h-[600px]">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                    {generatedCV}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuilderPage;