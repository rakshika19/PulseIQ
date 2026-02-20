// src/components/ResultScreen.jsx
import {
    Award,
    TrendingUp,
    Heart,
    ArrowLeft,
    Share2,
    Calendar,
    MessageCircle,
    Shield,
    CheckCircle,
    AlertCircle,
    Info
  } from 'lucide-react';
  
  export default function ResultScreen({ result, onRestart }) {
    // 🔹 Severity color mapping (soft blue scale)
    const getSeverityColor = (severity) => {
      switch (severity.toLowerCase()) {
        case 'minimal':
          return '#60a5fa'; // blue-400
        case 'mild':
          return '#3b82f6'; // blue-500
        case 'moderate':
          return '#2563eb'; // blue-600
        case 'moderately_severe':
        case 'moderately severe':
          return '#1d4ed8'; // blue-700
        case 'severe':
          return '#1e40af'; // blue-800
        default:
          return '#2563eb';
      }
    };
  
    const getSeverityIcon = (severity) => {
      switch (severity.toLowerCase()) {
        case 'minimal':
        case 'mild':
          return <CheckCircle className="w-5 h-5" />;
        case 'moderate':
          return <Info className="w-5 h-5" />;
        case 'moderately_severe':
        case 'moderately severe':
        case 'severe':
          return <AlertCircle className="w-5 h-5" />;
        default:
          return <Heart className="w-5 h-5" />;
      }
    };
  
    const getSeverityMessage = (severity) => {
      switch (severity.toLowerCase()) {
        case 'minimal':
          return "You're doing well! Keep up the great self-care habits.";
        case 'mild':
          return "You're managing well overall. Consider some additional self-care strategies.";
        case 'moderate':
          return "Your responses suggest some challenges. Consider reaching out for support.";
        case 'moderately_severe':
        case 'moderately severe':
          return "Your responses indicate significant concerns. Professional support is recommended.";
        case 'severe':
          return "Your responses suggest you may benefit from immediate professional support.";
        default:
          return "Thank you for completing the assessment.";
      }
    };
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Assessment Complete
          </h2>
          <p className="text-gray-500">
            Your personalized mental wellness insights
          </p>
        </div>
  
        {/* Score Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Your Assessment Score
              </h3>
            </div>
  
            <div
              className="text-6xl font-bold mb-2"
              style={{ color: getSeverityColor(result.severity) }}
            >
              {result.total_score}
            </div>
  
            <div
              className="text-xl font-semibold mb-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: getSeverityColor(result.severity) + '20',
                color: getSeverityColor(result.severity)
              }}
            >
              {getSeverityIcon(result.severity)}
              <span className="capitalize">
                {result.severity.replace('_', ' ')}
              </span>
            </div>
  
            <p className="text-gray-500 max-w-md mx-auto">
              {getSeverityMessage(result.severity)}
            </p>
          </div>
        </div>
  
        {/* Personalized Message */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Personalized Insights
              </h4>
              <p className="text-gray-700 leading-relaxed">{result.message}</p>
            </div>
          </div>
        </div>
  
        {/* Actions */}
        <div className="space-y-4">
          {result.next_step_url && (
            <a
              href={result.next_step_url}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Counselor Session</span>
            </a>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onRestart}
              className="px-6 py-3 border border-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
  
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share Result</span>
            </button>
          </div>
        </div>
  
        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">Your Privacy is Protected</p>
              <p className="text-gray-500">
                This assessment is anonymous. Your responses are used only to
                provide personalized insights.
              </p>
            </div>
          </div>
        </div>
  
      </div>
    );
  }