// src/components/QuestionScreen.jsx
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from 'lucide-react';

export default function QuestionScreen({
  question,
  selected,
  onSelect,
  onBack,
  onSkip,
  isFirst,
  isLast,
  progress,
  currentIndex,
  totalQuestions
}) {
  // 🔹 Option color dots (kept but softened)
  const getOptionColor = (idx) => {
    const colors = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'];
    return colors[idx] || '#d1d5db';
  };

  const getOptionLabel = (idx) => {
    const labels = [
      'Not at all',
      'Several days',
      'More than half the days',
      'Nearly every day'
    ];
    return labels[idx] || `Option ${idx + 1}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">

      {/* ✅ Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ✅ Question */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.text}
        </h2>

        <p className="text-gray-500 mt-2">
          Please select the option that best describes your experience
        </p>
      </div>

      {/* ✅ Options */}
      <div className="space-y-4 mb-8">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full p-4 border rounded-xl text-left transition-all duration-200 hover:shadow-sm ${
              selected === idx
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/20'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Radio indicator */}
              <div className="flex-shrink-0">
                {selected === idx ? (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <Circle className="w-3 h-3 text-transparent" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {getOptionLabel(idx)}
                </div>
                <div className="text-sm text-gray-500 mt-1">{option}</div>
              </div>

              {/* Color dot */}
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getOptionColor(idx) }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* ✅ Navigation */}
      <div className="flex justify-between items-center">
        {/* Back */}
        <button
          onClick={onBack}
          disabled={isFirst}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isFirst
              ? 'opacity-50 cursor-not-allowed text-gray-400'
              : 'text-gray-800 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </div>
        </button>

        {/* Middle text */}
        <div className="text-sm text-gray-500">
          {isLast ? 'Final question!' : `${totalQuestions - currentIndex - 1} more to go`}
        </div>

        {/* Next / Submit */}
        <button
          onClick={onSkip}
          disabled={selected === undefined}
          className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            selected === undefined
              ? 'opacity-50 cursor-not-allowed bg-gray-300 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <span>{isLast ? 'Submit' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}