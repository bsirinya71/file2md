import React from 'react';
import { StepItem } from './StepItem';
import { StepConfig } from '../../types/conversion';

interface ConversionStepperProps {
  steps: StepConfig[];
}

export const ConversionStepper: React.FC<ConversionStepperProps> = ({ steps }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
      <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
        Conversion Progress
      </h3>
      <div className="py-2">
        {steps.map((step, idx) => (
          <StepItem key={step.id} step={step} isLast={idx === steps.length - 1} />
        ))}
      </div>
    </div>
  );
};