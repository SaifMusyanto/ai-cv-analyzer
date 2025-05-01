import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart, FileCheck, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Transform Your CV with AI-Powered Analysis and Building
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Get professional feedback on your current CV and build an improved version tailored to your target application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/analyzer')}
              className="bg-blue-700 text-blue-700 hover:bg-white hover:text-blue-700 border border-white"
              rightIcon={<ChevronRight className="h-5 w-5" />}
            >
              Analyze Your CV
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/builder')}
              className="border-white text-white hover:bg-blue-700 hover:text-blue-700"
            >
              Build a New CV
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            How CV Master Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform uses advanced AI to analyze and improve your CV, helping you stand out to employers and admissions committees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">CV Analysis</h3>
            <p className="text-gray-600">
              Upload your CV and get instant feedback on its strengths and weaknesses for your target application.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Scores</h3>
            <p className="text-gray-600">
              Receive comprehensive scoring across relevance, structure, writing, experience, and professionalism.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">CV Builder</h3>
            <p className="text-gray-600">
              Use AI to automatically generate an improved version of your CV based on the analysis and feedback.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Ready to Improve Your CV?
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Start with a free analysis and see how our AI can help you create a CV that stands out.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/analyzer')}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default HomePage;