import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ApplicationType = 'job' | 'scholarship' | 'organization' | 'volunteer';

export interface ScoreData {
  overall: number;
  relevance: number;
  structure: number;
  writing: number;
  experience: number;
  professionalism: number;
}

export interface Suggestion {
  section: string;
  issue: string;
  suggestion: string;
  example?: string;
}

export interface CVAnalysisData {
  applicationInfo: {
    type: ApplicationType;
    name: string;
    description: string;
  };
  cvText: string;
  fileName: string;
  scores: ScoreData;
  suggestions: Suggestion[];
}

interface CVAnalysisContextType {
  analysisData: CVAnalysisData | null;
  setAnalysisData: React.Dispatch<React.SetStateAction<CVAnalysisData | null>>;
  isAnalyzing: boolean;
  setIsAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
  resetAnalysis: () => void;
  getRemainingAnalyses: () => number;
  decrementRemainingAnalyses: () => void;
}

const CVAnalysisContext = createContext<CVAnalysisContextType | undefined>(undefined);

export const CVAnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisData] = useState<CVAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const resetAnalysis = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
  };

  const getRemainingAnalyses = (): number => {
    const storedValue = localStorage.getItem('remainingAnalyses');
    if (storedValue === null) {
      localStorage.setItem('remainingAnalyses', '3');
      return 3;
    }
    return parseInt(storedValue, 10);
  };

  const decrementRemainingAnalyses = () => {
    const remaining = getRemainingAnalyses();
    if (remaining > 0) {
      localStorage.setItem('remainingAnalyses', (remaining - 1).toString());
    }
  };

  return (
    <CVAnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        isAnalyzing,
        setIsAnalyzing,
        selectedTemplate,
        setSelectedTemplate,
        resetAnalysis,
        getRemainingAnalyses,
        decrementRemainingAnalyses,
      }}
    >
      {children}
    </CVAnalysisContext.Provider>
  );
};

export const useCVAnalysis = () => {
  const context = useContext(CVAnalysisContext);
  if (context === undefined) {
    throw new Error('useCVAnalysis must be used within a CVAnalysisProvider');
  }
  return context;
};