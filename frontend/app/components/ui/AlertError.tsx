export default function AlertError({ message }: { message?: string | null }) {
  if (!message) return null;
  
  return (
    <div className="mb-6 p-4 glass border border-[#ed842e]/40 bg-[#ed842e]/10 text-[#07497f] font-medium rounded-xl flex items-center gap-3 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-[#ed842e]" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}
