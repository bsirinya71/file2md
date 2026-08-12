import { useState } from "react";
import { Layout } from "./components/common/Layout";
import { UploadContainer } from "./components/upload/UploadContainer";
import { UploadResponseData } from "./types/upload";
import { DocumentAst } from './types/extraction';
import { ConversionContainer } from "./components/conversion/ConversionContainer";

export function App() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [extractedAst, setExtractedAst] = useState<DocumentAst | null>(null);

  const handleUploadSuccess = (data: UploadResponseData) => {
    setCurrentSessionId(data.session_id);
  };

  const handleConversionComplete = (ast: DocumentAst) => {
    setExtractedAst(ast);
    console.log('Document Conversion Completed Successfully:', ast);
  };

  const handleResetAll = () => {
    setCurrentSessionId(null);
    setExtractedAst(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900">Document to Markdown Converter</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Upload PDF, Word, PowerPoint, or Image documents to generate high-quality structured Markdown.
          </p>
        </div>

        {!currentSessionId && <UploadContainer onUploadSuccess={handleUploadSuccess} />}

        {currentSessionId && !extractedAst && (
          <ConversionContainer
            sessionId={currentSessionId}
            onConversionComplete={handleConversionComplete}
            onReset={handleResetAll}
          />
        )}

        {extractedAst && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-green-900">Extraction Complete!</h3>
            <p className="text-sm text-green-700">
              Parsed <span className="font-semibold">{extractedAst.blocks.length}</span> AST nodes and{' '}
              <span className="font-semibold">{extractedAst.images.length}</span> images.
            </p>
            <button
              type="button"
              onClick={handleResetAll}
              className="px-4 py-2 text-sm font-medium text-green-800 bg-green-100 rounded-lg hover:bg-green-200"
            >
              Convert Another Document
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;