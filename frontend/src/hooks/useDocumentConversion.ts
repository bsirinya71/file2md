import { useState, useCallback } from 'react';
import { ConversionState, StepConfig } from '../types/conversion';
import { documentService } from '../services/documentService';
import { DocumentAst } from '../types/extraction';
import { CustomApiError } from '../types/api';

const defaultSteps: StepConfig[] = [
  {
    id: 'upload',
    label: 'Document Upload',
    description: 'Uploading source file to secure session',
    status: 'completed',
  },
  {
    id: 'extract_doc',
    label: 'Document Extraction',
    description: 'Parsing text, headings, lists, and tables',
    status: 'pending',
  },
  {
    id: 'extract_images',
    label: 'Image Processing',
    description: 'Extracting and classifying embedded images',
    status: 'pending',
  },
  {
    id: 'build_ast',
    label: 'AST Generation',
    description: 'Structuring document into Markdown AST tree',
    status: 'pending',
  },
];

interface UseDocumentConversionReturn {
  conversionState: ConversionState;
  startConversion: (sessionId: string) => Promise<DocumentAst | null>;
  resetConversion: () => void;
}

export function useDocumentConversion(
  onCompleteCallback?: (ast: DocumentAst) => void
): UseDocumentConversionReturn {
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    currentStepIndex: 0,
    steps: defaultSteps,
    error: null,
    sessionId: null,
  });

  const updateStepStatus = (stepId: string, status: StepConfig['status'], errorMsg?: string) => {
    setConversionState((prev) => {
      const nextSteps = prev.steps.map((step) => {
        if (step.id === stepId) {
          return { ...step, status, error: errorMsg || null };
        }
        return step;
      });
      return { ...prev, steps: nextSteps };
    });
  };

  const startConversion = useCallback(
    async (sessionId: string): Promise<DocumentAst | null> => {
      setConversionState({
        status: 'extracting_doc',
        currentStepIndex: 1,
        steps: defaultSteps.map((s) => (s.id === 'upload' ? { ...s, status: 'completed' } : { ...s, status: 'pending' })),
        error: null,
        sessionId,
      });

      try {
        // Step 2: Document Text Extraction
        updateStepStatus('extract_doc', 'active');
        // Small delay for fluid UX animation
        await new Promise((resolve) => setTimeout(resolve, 400));
        updateStepStatus('extract_doc', 'completed');

        // Step 3: Image Processing
        setConversionState((prev) => ({ ...prev, status: 'extracting_images', currentStepIndex: 2 }));
        updateStepStatus('extract_images', 'active');
        
        // Trigger actual backend processing API
        const astResult = await documentService.extractDocument(sessionId);
        
        updateStepStatus('extract_images', 'completed');

        // Step 4: Building AST
        setConversionState((prev) => ({ ...prev, status: 'building_ast', currentStepIndex: 3 }));
        updateStepStatus('build_ast', 'active');
        await new Promise((resolve) => setTimeout(resolve, 300));
        updateStepStatus('build_ast', 'completed');

        setConversionState((prev) => ({
          ...prev,
          status: 'completed',
        }));

        if (onCompleteCallback) {
          onCompleteCallback(astResult);
        }

        return astResult;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof CustomApiError
            ? err.message
            : 'An error occurred during document conversion.';

        setConversionState((prev) => {
          const failedIndex = prev.currentStepIndex;
          const failedStepId = prev.steps[failedIndex]?.id;

          const updatedSteps = prev.steps.map((step, idx) => {
            if (idx === failedIndex) {
              return { ...step, status: 'error' as const, error: errorMessage };
            }
            return step;
          });

          return {
            ...prev,
            status: 'error',
            error: errorMessage,
            steps: updatedSteps,
          };
        });

        return null;
      }
    },
    [onCompleteCallback]
  );

  const resetConversion = useCallback(() => {
    setConversionState({
      status: 'idle',
      currentStepIndex: 0,
      steps: defaultSteps,
      error: null,
      sessionId: null,
    });
  }, []);

  return {
    conversionState,
    startConversion,
    resetConversion,
  };
}