import { useState } from "react";
import { Layout } from "./components/common/Layout";
import { UploadContainer } from "./components/upload/UploadContainer";
import { UploadResponseData } from "./types/upload";
import { DocumentAst } from './types/extraction';
import { ConversionContainer } from "./components/conversion/ConversionContainer";
import { DocumentResultView } from "./components/document/DocumentresultView";

export function App() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [extractedAst, setExtractedAst] = useState<DocumentAst | null>(null);

  const handleUploadSuccess = (data: UploadResponseData) => {
    setCurrentSessionId(data.session_id);
  };

  const handleConversionComplete = (ast: DocumentAst) => {
    setExtractedAst(ast);
  };

  const handleResetAll = () => {
    setCurrentSessionId(null);
    setExtractedAst(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {!currentSessionId && (
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900">Document to Markdown Converter</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              Upload PDF, Word, PowerPoint, or Image documents to generate high-quality structured Markdown.
            </p>
          </div>
        )}

        {!currentSessionId && <UploadContainer onUploadSuccess={handleUploadSuccess} />}

        {currentSessionId && !extractedAst && (
          <ConversionContainer
            sessionId={currentSessionId}
            onConversionComplete={handleConversionComplete}
            onReset={handleResetAll}
          />
        )}

        {extractedAst && (
          <DocumentResultView ast={extractedAst} onReset={handleResetAll} />
        )}
      </div>
    </Layout>
  );
}

export default App;