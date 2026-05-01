import React from 'react';
import { User, BookOpen, ExternalLink, Tag } from 'lucide-react';

const InsightSidebar: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section 1: Source Metadata */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <BookOpen size={14} /> Shastric Context
        </h3>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Pramāna</span>
            <span className="font-semibold text-slate-800">SHRUTI</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Author</span>
            <span className="font-semibold text-slate-800">Apauruṣeya</span>
          </div>
        </div>
      </section>

      {/* Section 2: Taxonomy Tags */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Tag size={14} /> Conceptual Taxonomy
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Brahman', 'Paramātmā', 'Bhagavān', 'Svayam-Rupa'].map((tag) => (
            <span key={tag} className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Section 3: Verified Links */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <ExternalLink size={14} /> Absolute Sources
        </h3>
        <ul className="space-y-3">
          <li className="group">
            <a href="https://vedabase.io/en/library/bg/15/15/" target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <span>Bhagavad Gita 15.15</span>
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </li>
          <li className="group">
            <a href="https://vedabase.io/en/library/sb/1/1/1/" target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <span>Bhagavata Purana 1.1.1</span>
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default InsightSidebar;
