import React, { useEffect } from 'react';
import { useDocumentConversion } from '../../hooks/useDocumentConversion';
import { ConversionStepper } from './ConversionStepper';
import { DocumentAst } from '../../types/extraction';

interface ConversionContainerProps {
  sessionId: string;
  onConversionComplete: (ast: DocumentAst) => void;
  onReset: () => void;
}

export const ConversionContainer: React.FC<ConversionContainerProps> = ({
  sessionId,
  onConversionComplete,
  onReset,
}) => {
  const { conversionState, startConversion } = useDocumentConversion(onConversionComplete);

  useEffect(() => {
    if (sessionId && conversionState.status === 'idle') {
      startConversion(sessionId);
    }
  }, [sessionId, conversionState.status, startConversion]);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <ConversionStepper steps={conversionState.steps} />

      {conversionState.status === 'error' && (
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Start Over
          </button>
          <button
            type="button"
            onClick={() => startConversion(sessionId)}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-sm"
          >
            Retry Step
          </button>
        </div>
      )}
    </div>
  );
};