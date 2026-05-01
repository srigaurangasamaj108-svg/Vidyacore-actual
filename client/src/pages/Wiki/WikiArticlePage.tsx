import React, { Suspense, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { trpc } from '../../utils/trpc';
import { ChevronRight, Home, ArrowLeft, ArrowRight } from 'lucide-react';

// Dynamically import all MDX files as React components
const articles = import.meta.glob('../../content/*.mdx');

const ShlokaBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-blue-50/50 border-l-4 border-blue-400 p-8 my-10 rounded-r-2xl shadow-sm hover:shadow-md transition-shadow">
    <div className="text-center italic text-slate-800 space-y-4">
      {children}
    </div>
  </div>
);

const WikiArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: node } = trpc.getNodeBySlug.useQuery({ slug: slug || '' }, { enabled: !!slug });
  const { data: allNodes } = trpc.getTree.useQuery();

  const { prevNode, nextNode } = useMemo(() => {
    if (!allNodes || !slug) return { prevNode: null, nextNode: null };
    const currentIndex = allNodes.findIndex(n => n.slug === slug);
    return {
      prevNode: currentIndex > 0 ? allNodes[currentIndex - 1] : null,
      nextNode: currentIndex < allNodes.length - 1 ? allNodes[currentIndex + 1] : null
    };
  }, [allNodes, slug]);

  const ContentComponent = useMemo(() => {
    const path = `../../content/${slug}.mdx`;
    if (articles[path]) {
      return React.lazy(articles[path] as any);
    }
    return null;
  }, [slug]);

  if (!ContentComponent) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-300">Artha Not Found</h2>
        <p className="text-slate-400 mt-2 italic">The wisdom you seek is not yet manifested in this branch.</p>
      </div>
    );
  }

  return (
    <div className="wiki-article-container space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🧭 Breadcrumbs & Nav Bar */}
      <nav className="flex items-center justify-between py-4 border-b border-slate-100 mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium overflow-hidden">
          <Link to="/wiki/sri-krishna" className="hover:text-blue-600 flex items-center gap-1 shrink-0">
            <Home size={14} /> Sri Krishna
          </Link>
          {node && node.slug !== 'sri-krishna' && (
            <>
              <ChevronRight size={12} className="shrink-0" />
              <span className="text-slate-600 truncate">{node.name}</span>
            </>
          )}
        </div>
        
        <div className="flex gap-2 shrink-0">
           <button 
             onClick={() => prevNode && navigate(`/wiki/${prevNode.slug}`)}
             disabled={!prevNode}
             className={`p-2 transition-colors ${prevNode ? 'text-slate-600 hover:text-blue-600' : 'text-slate-200 cursor-not-allowed'}`}
             title={prevNode?.name}
           >
              <ArrowLeft size={16} />
           </button>
           <button 
             onClick={() => nextNode && navigate(`/wiki/${nextNode.slug}`)}
             disabled={!nextNode}
             className={`p-2 transition-colors ${nextNode ? 'text-slate-600 hover:text-blue-600' : 'text-slate-200 cursor-not-allowed'}`}
             title={nextNode?.name}
           >
              <ArrowRight size={16} />
           </button>
        </div>
      </nav>


      {/* 🏛️ Article Surface */}
      <article className="prose prose-slate prose-blue max-w-none 
        prose-headings:text-center prose-headings:font-black
        prose-h1:text-5xl prose-h1:mb-12
        prose-p:leading-relaxed prose-p:text-slate-600
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
        
        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-slate-100 rounded w-3/4 mx-auto" />
            <div className="h-64 bg-slate-50 rounded" />
          </div>
        }>
          <ContentComponent />
        </Suspense>
      </article>

      {/* 🦶 Footer Navigation */}
      <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
         <div className="text-xs text-slate-400 italic">
           Source: VidyaCore Shastric Knowledge Graph v1.4.0
         </div>
      </div>
    </div>
  );
};

export default WikiArticlePage;
