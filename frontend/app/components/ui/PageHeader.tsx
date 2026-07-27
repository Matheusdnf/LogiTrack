export default function PageHeader({ 
  title, 
  subtitle, 
  buttonText, 
  onAction 
}: { 
  title: string; 
  subtitle: string; 
  buttonText: string; 
  onAction: () => void 
}) {
  return (
    <header className="glass rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[#748ca6]/20 shadow-md">
      <div>
        <h1 className="text-3xl font-bold text-[#07497f]" style={{ fontFamily: "var(--font-outfit)" }}>
          {title}
        </h1>
        <p className="text-[#748ca6] text-sm mt-1">{subtitle}</p>
      </div>
      <button 
        onClick={onAction} 
        className="bg-[#ed842e] hover:bg-[#ed842e]/90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
      >
        <span>{buttonText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </header>
  );
}
