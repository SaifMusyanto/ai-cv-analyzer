import React from 'react';
import { useCVAnalysis } from '../contexts/CVAnalysisContext';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a touch of color',
    image: 'https://images.pexels.com/photos/6393013/pexels-photo-6393013.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with elegant typography',
    image: 'https://images.pexels.com/photos/6393009/pexels-photo-6393009.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative fields and industries',
    image: 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const CVTemplateSelector: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useCVAnalysis();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select CV Template</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVTemplateSelector;