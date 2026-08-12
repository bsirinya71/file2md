import { Layout } from "./components/common/Layout";
import { UploadContainer } from "./components/upload/UploadContainer";
import { UploadResponseData } from "./types/upload";

export function App() {
  const handleUploadSuccess = (data: UploadResponseData) => {
    console.log('Uploaded successfully:', data);
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

        <UploadContainer onUploadSuccess={handleUploadSuccess} />
      </div>
    </Layout>
  );
}

export default App;