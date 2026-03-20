export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center p-4">
      <div>
        <p className="text-8xl font-bold text-gray-100 mb-4">404</p>
        <p className="text-xl font-semibold text-gray-900 mb-2">Profile not found</p>
        <a href="/" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-yellow-400 hover:text-yellow-700 transition-all">
          ← Back to TrustBank
        </a>
      </div>
    </div>
  );
}
