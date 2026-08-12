import React from 'react';
import { StepConfig } from '../../types/conversion';

interface StepItemProps {
  step: StepConfig;
  isLast: boolean;
}

export const StepItem: React.FC<StepItemProps> = ({ step, isLast }) => {
  const renderIcon = () => {
    switch (step.status) {
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ✓
          </div>
        );
      case 'active':
        return (
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-sm animate-pulse">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ✕
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-sm">
            •
          </div>
        );
    }
  };

  return (
    <div className="flex items-start space-x-4 relative">
      <div className="flex flex-col items-center">
        {renderIcon()}
        {!isLast && (
          <div
            className={`w-0.5 h-10 my-1 transition-colors duration-300 ${
              step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        )}
      </div>

      <div className="flex-1 pt-1">
        <h4
          className={`text-sm font-semibold ${
            step.status === 'active'
              ? 'text-brand-600'
              : step.status === 'completed'
              ? 'text-gray-900'
              : step.status === 'error'
              ? 'text-red-600'
              : 'text-gray-400'
          }`}
        >
          {step.label}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
        {step.error && <p className="text-xs text-red-600 mt-1 font-medium">{step.error}</p>}
      </div>
    </div>
  );
};