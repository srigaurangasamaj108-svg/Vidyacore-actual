import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '../../../utils/trpc';


import { useNavigate, useParams } from 'react-router-dom';

interface TreeNode {
  id: number;
  name: string;
  nameDevanagari: string | null;
  slug: string;
  nodeType: string;
  parentId: number | null;
  children?: TreeNode[];
}

const TreeItem: React.FC<{ node: TreeNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const navigate = useNavigate();
  const { slug: activeSlug } = useParams<{ slug: string }>();
  const isActive = activeSlug === node.slug;

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200
          ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          navigate(`/wiki/${node.slug}`);
        }}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown size={14} className="text-blue-400" /> : <ChevronRight size={14} className="text-slate-400" />
        ) : (
          <div className="w-3.5" />
        )}
        <div className="flex flex-col overflow-hidden">
          <span className={`text-sm font-semibold truncate ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>
            {node.name}
          </span>
          {node.nameDevanagari && (
            <span className="text-[10px] text-slate-400 font-sanskrit truncate leading-none">
              {node.nameDevanagari}
            </span>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children?.map(child => (
              <TreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TreeView: React.FC = () => {
  const { data: nodes, isLoading, error } = trpc.getTree.useQuery();

  if (error) {
    console.error('--- TRPC ERROR ---');
    console.error(error);
  }

  const treeData = React.useMemo(() => {
    console.log('--- TREEVIEW SYNC ---');
    console.log('Raw Nodes from Server:', nodes);
    if (!nodes) return [];
    const map: Record<string, TreeNode> = {};
    const roots: TreeNode[] = [];

    nodes.forEach(node => {
      const id = String(node.id);
      map[id] = { ...node, id: Number(node.id), parentId: node.parentId ? Number(node.parentId) : null, children: [] };
    });

    Object.values(map).forEach(node => {
      const pId = node.parentId ? String(node.parentId) : null;
      if (pId && map[pId]) {
        map[pId].children?.push(node);
      } else {
        roots.push(node);
      }
    });

    console.log('Processed Tree Structure:', roots);
    return roots;
  }, [nodes]);



  if (isLoading) return <div className="p-4 space-y-3 animate-pulse">
    {[1,2,3].map(i => <div key={i} className="h-8 bg-slate-100 rounded" />)}
  </div>;

  if (treeData.length === 0 && !isLoading) return (
    <div className="p-4 text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
      The Kalpataru has no roots in this soil. <br/> (Check DB Connection)
    </div>
  );


  return (
    <div className="space-y-1 pb-10">
      {treeData.map(root => (
        <TreeItem key={root.id} node={root} depth={0} />
      ))}
    </div>
  );


};


export default TreeView;
