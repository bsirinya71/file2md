import { Layout } from "./components/common/Layout";

export function App() {
  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">FILE2MD Engine Started</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Frontend Foundation & Architecture is configured successfully. Ready for Phase 2 Upload UI Integration.
        </p>
      </div>
    </Layout>
  );
}

export default App;