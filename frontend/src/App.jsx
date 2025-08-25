import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold">LexLink</h1>
          <p className="opacity-90 mt-2">Upload a document. Get the gist, the gotchas, and what to do next.</p>
        </header>
        <UploadForm />
      </main>
      <footer className="text-center text-gray-300 py-6 text-sm">© {new Date().getFullYear()} LexLink</footer>
    </div>
  );
}
