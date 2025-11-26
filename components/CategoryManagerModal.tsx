import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, Trash2, Edit2, Plus, Check, Save } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onUpdateCategories,
  onDeleteCategory
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newCatName, setNewCatName] = useState('');

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    if (direction === 'up' && index > 0) {
      [newCats[index], newCats[index - 1]] = [newCats[index - 1], newCats[index]];
    } else if (direction === 'down' && index < newCats.length - 1) {
      [newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]];
    }
    onUpdateCategories(newCats);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    const newCats = categories.map(c => c.id === editingId ? { ...c, name: editName.trim() } : c);
    onUpdateCategories(newCats);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      icon: 'Folder'
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold dark:text-white">分类管理</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group">
              
              {/* Order Controls */}
              <div className="flex flex-col gap-1 mr-2">
                <button 
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-0.5 text-slate-400 hover:text-blue-500 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === categories.length - 1}
                  className="p-0.5 text-slate-400 hover:text-blue-500 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              {/* Name (Edit Mode vs View Mode) */}
              <div className="flex-1">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-1 px-2 text-sm rounded border border-blue-500 dark:bg-slate-800 dark:text-white outline-none"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-green-500 hover:bg-green-50 dark:hover:bg-slate-600 p-1 rounded"><Check size={16}/></button>
                  </div>
                ) : (
                  <span className="font-medium dark:text-slate-200">{cat.name}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {editingId !== cat.id && (
                  <button onClick={() => startEdit(cat)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
                    <Edit2 size={14} />
                  </button>
                )}
                <button 
                  onClick={() => { if(confirm(`确定删除"${cat.name}"分类吗？该分类下的书签将移动到"常用推荐"。`)) onDeleteCategory(cat.id); }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
           <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">添加新分类</label>
           <div className="flex gap-2">
             <input 
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="分类名称"
                className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
             />
             <button 
                onClick={handleAdd}
                disabled={!newCatName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
             >
               <Plus size={18} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerModal;