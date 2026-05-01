import React from 'react';
import { Outlet } from 'react-router-dom';
import TreeView from '../../components/Wiki/TreeNavigator/TreeView';
import InsightSidebar from '../../components/Wiki/InsightPanel/InsightSidebar';

const WikiLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* 🌳 Left Panel: The Nigama Tree (25%) */}
      <aside className="w-1/4 border-r border-slate-200 bg-white shadow-sm overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🌿</span> Nigama Tree
          </h2>
          <div className="mt-6">
            <TreeView />
          </div>
        </div>
      </aside>

      {/* 📖 Central Panel: The Knowledge Surface (50%) */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto p-12">
          <Outlet />
        </div>
      </main>

      {/* 🧠 Right Panel: Epistemic Insight (25%) */}
      <aside className="w-1/4 border-l border-slate-200 bg-slate-50 overflow-y-auto">
        <div className="p-6">
          <InsightSidebar />
        </div>
      </aside>
    </div>
  );
};

export default WikiLayout;
