import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, Info } from 'lucide-react';
import TreeView from '../../components/Wiki/TreeNavigator/TreeView';
import InsightSidebar from '../../components/Wiki/InsightPanel/InsightSidebar';

const WikiLayout: React.FC = () => {
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [isInsightOpen, setIsInsightOpen] = useState(true);
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 🌳 Left Panel: The Nigama Tree */}
      <aside 
        className={`${isTreeOpen ? 'block' : 'hidden'} h-full border-r border-slate-200 bg-white shadow-sm overflow-y-auto overflow-x-hidden relative group transition-all duration-300`}
        style={{ width: '25%', minWidth: '250px', maxWidth: '40%' }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8">
            <span className="text-2xl">🌿</span> Nigama Tree
          </h2>
          <TreeView />
        </div>
      </aside>

      {/* 📖 Central Panel: The Knowledge Surface */}
      <main className="flex-1 overflow-y-auto bg-white relative shadow-inner">
        {/* Manual Toggle Buttons (Floating) */}
        <div className="sticky top-0 z-20 flex justify-between p-4 pointer-events-none">
           <button 
             onClick={() => setIsTreeOpen(!isTreeOpen)} 
             className="p-2 bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-sm hover:bg-white transition-all pointer-events-auto"
           >
              {isTreeOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
           </button>
           <button 
             onClick={() => setIsInsightOpen(!isInsightOpen)} 
             className="p-2 bg-white/90 backdrop-blur border border-slate-200 rounded-lg shadow-sm hover:bg-white transition-all pointer-events-auto"
           >
              {isInsightOpen ? <ChevronRight size={16} /> : <Info size={16} />}
           </button>
        </div>

        <div className="max-w-4xl mx-auto px-12 pb-20 -mt-8">
          <Outlet key={slug} />
        </div>
      </main>

      {/* 🧠 Right Panel: Epistemic Insight */}
      <aside 
        className={`${isInsightOpen ? 'block' : 'hidden'} h-full border-l border-slate-200 bg-slate-50/50 overflow-y-auto transition-all duration-300`}
        style={{ width: '20%', minWidth: '200px', maxWidth: '30%' }}
      >
        <div className="p-6">
          <InsightSidebar />
        </div>
      </aside>
    </div>
  );
};

export default WikiLayout;
