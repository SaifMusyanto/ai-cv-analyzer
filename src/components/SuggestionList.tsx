import React, { useState } from 'react';
import { Suggestion } from '../contexts/CVAnalysisContext';
import { AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react';

interface SuggestionListProps {
  suggestions: Suggestion[];
}

const SuggestionList: React.FC<SuggestionListProps> = ({ suggestions }) => {

  const getSectionColor = (section: string) => {
    switch (section.toLowerCase()) {
      case 'header':
        return 'bg-blue-100 text-blue-800';
      case 'experience':
        return 'bg-green-100 text-green-800';
      case 'skills':
        return 'bg-purple-100 text-purple-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      case 'overall':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Improvement Suggestions</h3>
        
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSectionColor(suggestion.section)}`}>
                      {suggestion.section}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{suggestion.issue}</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p>{suggestion.suggestion}</p>
                    </div>
                  </div>
                  
                  {suggestion.example && (
                    <div className="mt-3 bg-gray-50 rounded-md p-3 relative group">
                      <p>
                        {suggestion.example}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionList;