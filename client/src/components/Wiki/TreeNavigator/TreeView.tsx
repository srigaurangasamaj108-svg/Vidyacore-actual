import React from 'react';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const TreeView: React.FC = () => {
  // Mock data for initial visualization of Sri Krishna node
  const nodes = [
    { id: 1, name: 'Sri Krishna', name_devanagari: 'श्रीकृष्ण', slug: 'sri-krishna', type: 'MULA' },
  ];

  return (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <motion.li
          key={node.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group"
        >
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">{node.name}</span>
              <span className="text-xs text-slate-400 font-sanskrit">{node.name_devanagari}</span>
            </div>
            <span className="ml-auto text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {node.type}
            </span>
          </div>
        </motion.li>
      ))}
      <li className="p-2 text-xs text-slate-400 italic">
        (More branches will appear as we ingest them...)
      </li>
    </ul>
  );
};

export default TreeView;
