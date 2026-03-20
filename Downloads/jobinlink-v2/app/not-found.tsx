export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-center p-4">
      <div>
        <div className="text-8xl font-bold text-[#27272a] mb-4">404</div>
        <p className="text-white text-xl font-semibold mb-2">Página não encontrada</p>
        <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-all">Voltar</a>
      </div>
    </div>
  );
}
