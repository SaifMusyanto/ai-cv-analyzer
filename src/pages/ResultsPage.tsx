import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVAnalysis } from '../contexts/CVAnalysisContext';
import { FileText, FileEdit, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import ScoreCard from '../components/ScoreCard';
import SuggestionList from '../components/SuggestionList';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisData, isAnalyzing, resetAnalysis } = useCVAnalysis();
  
  useEffect(() => {
    // Redirect to analyzer if no data is available
    if (!analysisData && !isAnalyzing) {
      navigate('/analyzer');
    }
  }, [analysisData, isAnalyzing, navigate]);
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your CV</h2>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is carefully reviewing your CV and comparing it to your application requirements. This may take a moment...
        </p>
      </div>
    );
  }
  
  if (!analysisData) {
    return null; // Will redirect due to useEffect
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/analyzer')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Analyzer
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">CV Analysis Results</h1>
        <p className="text-lg text-gray-600">
          Here's how your CV performs for: <span className="font-semibold">{analysisData.applicationInfo.name}</span>
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
        <div className="flex items-start">
          <FileText className="h-6 w-6 text-blue-600 mt-1 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Analyzed Document</h3>
            <p className="text-gray-600">{analysisData.fileName}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {analysisData.applicationInfo.type === 'job' ? 'Job Application' :
                 analysisData.applicationInfo.type === 'scholarship' ? 'Scholarship' :
                 analysisData.applicationInfo.type === 'organization' ? 'Organization' : 'Volunteer Position'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        <ScoreCard scores={analysisData.scores} />
        <SuggestionList suggestions={analysisData.suggestions} />
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to build an improved CV?</h3>
          <p className="text-gray-600 mb-4">
            Use our CV Builder to create an optimized version based on this analysis.
          </p>
          <Button 
            onClick={() => navigate('/builder')}
            leftIcon={<FileEdit className="h-5 w-5" />}
          >
            Build Improved CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;