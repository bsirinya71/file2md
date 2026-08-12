export type ConversionStepId = 'upload' | 'extract_doc' | 'extract_images' | 'build_ast';

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface StepConfig {
  id: ConversionStepId;
  label: string;
  description: string;
  status: StepStatus;
  error?: string | null;
}

export type ConversionStatus =
  | 'idle'
  | 'uploading'
  | 'extracting_doc'
  | 'extracting_images'
  | 'building_ast'
  | 'completed'
  | 'error';

export interface ConversionState {
  status: ConversionStatus;
  currentStepIndex: number;
  steps: StepConfig[];
  error: string | null;
  sessionId: string | null;
}