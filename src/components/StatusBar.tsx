"use client";

export default function StatusBar() {
  return (
    <div className="status" aria-hidden="true">
      <span className="num">9:41</span>
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 16h2v4H2zm4-3h2v7H6zm4-3h2v10h-2zm4-3h2v13h-2zm4-4h2v17h-2z" />
        </svg>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6H8a4 4 0 00-4 4v4a4 4 0 004 4h8a4 4 0 004-4v-4a4 4 0 00-4-4zm2 8a2 2 0 01-2 2H8a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2v4zm3-5v6h1.5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5H21z" />
        </svg>
      </div>
    </div>
  );
}
