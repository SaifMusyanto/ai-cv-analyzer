import React from 'react';
import { ScoreData } from '../contexts/CVAnalysisContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

interface ScoreCardProps {
  scores: ScoreData;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ scores }) => {
  const scoreData = [
    { name: 'Relevance', score: scores.relevance },
    { name: 'Structure', score: scores.structure },
    { name: 'Writing', score: scores.writing },
    { name: 'Experience', score: scores.experience },
    { name: 'Professionalism', score: scores.professionalism },
  ];

  const radarData = [
    {
      subject: 'Relevance',
      A: scores.relevance,
      fullMark: 100,
    },
    {
      subject: 'Structure',
      A: scores.structure,
      fullMark: 100,
    },
    {
      subject: 'Writing',
      A: scores.writing,
      fullMark: 100,
    },
    {
      subject: 'Experience',
      A: scores.experience,
      fullMark: 100,
    },
    {
      subject: 'Professionalism',
      A: scores.professionalism,
      fullMark: 100,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getOverallAnalysis = () => {
    const strengths = scoreData
      .filter(item => item.score >= 75)
      .map(item => item.name.toLowerCase());
    
    const weaknesses = scoreData
      .filter(item => item.score < 60)
      .map(item => item.name.toLowerCase());

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-gray-700 leading-relaxed">
          Your CV demonstrates {scores.overall >= 75 ? 'strong' : scores.overall >= 60 ? 'moderate' : 'limited'} overall effectiveness 
          with a score of {scores.overall}/100. {strengths.length > 0 && `You show particular strength in ${strengths.join(' and ')}`}
          {weaknesses.length > 0 && `, while ${weaknesses.join(' and ')} could benefit from improvement`}. 
          The analysis suggests that your CV is {scores.relevance >= 70 ? 'well-aligned' : 'somewhat misaligned'} with your target application, 
          with {scores.structure >= 70 ? 'clear' : 'improvable'} structure and {scores.writing >= 70 ? 'effective' : 'developing'} writing style. 
          Your experience presentation is {scores.experience >= 70 ? 'compelling' : 'could be strengthened'}, 
          and your overall professionalism is {scores.professionalism >= 70 ? 'commendable' : 'needs attention'}.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">CV Score Analysis</h3>
        
        {getOverallAnalysis()}
        
        <div className="flex flex-col md:flex-row md:items-center mb-6">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${scores.overall >= 80 ? 'text-green-500' : scores.overall >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                    strokeWidth="10"
                    strokeDasharray={`${scores.overall * 3.51} 351`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    transform="rotate(-90 64 64)"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-3xl font-bold ${getScoreColor(scores.overall)}`}>
                    {scores.overall}
                  </span>
                  <span className="block text-xs text-gray-500">Overall Score</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 md:pl-6">
            <div className="flex flex-col gap-3">
              {scoreData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">{item.name}</span>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          item.score >= 80
                            ? 'bg-green-500'
                            : item.score >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${getScoreColor(item.score)}`}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-64 my-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="CV Score"
                dataKey="A"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;