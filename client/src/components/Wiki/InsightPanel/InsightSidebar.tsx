import React from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../../../utils/trpc';


import { Info, Hash, GitBranch, BookOpen, Tag, ExternalLink } from 'lucide-react';

const InsightSidebar: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: node, isLoading } = trpc.getNodeBySlug.useQuery({ slug: slug || '' }, { enabled: !!slug });

  if (isLoading) return <div className="animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-1/2" />
    <div className="h-20 bg-slate-100 rounded" />
  </div>;

  if (!node) return (
    <div className="text-slate-400 italic text-sm p-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
      Select a node from the Nigama Tree to manifest its insights.
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Info size={14} className="text-blue-500" /> Epistemic Summary
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed italic bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 shadow-sm">
          {node.description || 'No description available for this sacred node.'}
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <GitBranch size={14} className="text-blue-500" /> Shastric Metadata
        </h3>
        
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
             <span className="text-xs text-slate-400">Node Type</span>
             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{node.nodeType}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
             <span className="text-xs text-slate-400">System Code</span>
             <span className="text-xs font-mono font-bold text-slate-600">{node.systemCode}</span>
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
