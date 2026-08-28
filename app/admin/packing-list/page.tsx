"use client";

import React, { useState, useEffect } from "react";
import AdminPageLayout from "@/app/admin/components/AdminPageLayout";
import { Plus, Trash2, Edit, Save, X, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import TipTapEditor from "@/app/components/admin/TipTapEditor";

const PACKING_CATEGORIES = [
  "MAIN TREKKING GEAR",
  "CLOTHING, HEADWEAR & FOOTWEAR",
  "TOILETRIES, HYGIENE & PERSONAL CARE",
  "HEALTH, FIRST AID, ELECTRONICS & ESSENTIALS",
  "OPTIONAL & RECOMMENDED ITEMS"
];

export default function PackingListAdmin() {
    const [items, setItems] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null); // Toggle description editor

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState<string | null>(null); // category name
  const [newItemName, setNewItemName] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

    const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/packing-list");
      const data = await res.json();
      setItems(data);
      
      const catRes = await fetch("/api/admin/packing-categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategoriesData(catData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (category: string) => {
    if (!newItemName.trim()) return;
    
    // Optimistic UI
    const tempId = "temp-" + Date.now();
    const newItem = { id: tempId, category, name: newItemName, order: items.filter(i => i.category === category).length };
    setItems([...items, newItem]);
    setNewItemName("");
    setIsAdding(null);

    try {
      const res = await fetch("/api/admin/packing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name: newItem.name, order: newItem.order }),
      });
      const data = await res.json();
      setItems(prev => prev.map(i => i.id === tempId ? data : i));
    } catch (err) {
      console.error(err);
      fetchItems(); // revert on error
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    setItems(prev => prev.map(i => i.id === id ? { ...i, name: editName } : i));
    setEditingId(null);

    try {
      await fetch(`/api/admin/packing-list/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await fetch(`/api/admin/packing-list/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  const handleSaveCategory = async (catName: string, description: string) => {
    setSavingCategory(catName);
    try {
      const res = await fetch("/api/admin/packing-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, description }),
      });
      const updated = await res.json();
      setCategoriesData(prev => {
        const exists = prev.find(p => p.name === catName);
        if (exists) return prev.map(p => p.name === catName ? updated : p);
        return [...prev, updated];
      });
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCategory(null);
    }
  };

  return (
    <AdminPageLayout
      title="Master Packing List"
      description="Manage the master list of all possible packing items grouped by category."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#24a0ed] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {PACKING_CATEGORIES.map((cat, idx) => {
            const catItems = items.filter(i => i.category === cat).sort((a, b) => a.order - b.order);
            const handleSaveCategory = async (catName: string, description: string) => {
    setSavingCategory(catName);
    try {
      const res = await fetch("/api/admin/packing-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, description }),
      });
      const updated = await res.json();
      setCategoriesData(prev => {
        const exists = prev.find(p => p.name === catName);
        if (exists) return prev.map(p => p.name === catName ? updated : p);
        return [...prev, updated];
      });
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCategory(null);
    }
  };

  return (
              <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#f8fbff] border-b border-gray-100 p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#112233] flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#24a0ed] text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {cat}
                    </h3>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setEditingCategory(editingCategory === cat ? null : cat)}
                        className="text-xs font-bold text-[#24a0ed] hover:underline flex items-center gap-1"
                      >
                        {editingCategory === cat ? "Close Description" : "Edit Description"}
                        {editingCategory === cat ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        {catItems.length} items
                      </span>
                    </div>
                  </div>
                  
                  {editingCategory === cat && (
                    <div className="mt-4 pt-4 border-t border-blue-100 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Category Description</label>
                      <TipTapEditor 
                        value={categoriesData.find(c => c.name === cat)?.description || ""} 
                        onChange={(val) => {
                          setCategoriesData(prev => {
                            const exists = prev.find(p => p.name === cat);
                            if (exists) return prev.map(p => p.name === cat ? { ...p, description: val } : p);
                            return [...prev, { name: cat, description: val }];
                          });
                        }} 
                        placeholder="Add a rich description for this packing category..." 
                        minHeight="150px"
                      />
                      <div className="flex justify-end mt-3">
                        <button 
                          onClick={() => handleSaveCategory(cat, categoriesData.find(c => c.name === cat)?.description || "")}
                          disabled={savingCategory === cat}
                          className="bg-[#24a0ed] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {savingCategory === cat ? "Saving..." : "Save Description"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 space-y-2">
                  {catItems.length === 0 ? (
                    <div className="text-sm text-gray-400 italic p-4 text-center border-2 border-dashed border-gray-100 rounded-lg">
                      No items in this category yet.
                    </div>
                  ) : (
                    catItems.map((item) => (
                      <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#f0f6fc] transition-colors">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-2 w-full max-w-md">
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                              autoFocus
                              onKeyDown={e => e.key === 'Enter' && handleUpdate(item.id)}
                            />
                            <button onClick={() => handleUpdate(item.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-200 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                              <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditName(item.name);
                                }}
                                className="p-1.5 text-blue-500 hover:bg-blue-100 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}

                  {isAdding === cat ? (
                    <div className="flex items-center gap-2 mt-4 max-w-md">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        placeholder="Enter item name..."
                        className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#24a0ed]"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleAdd(cat)}
                      />
                      <button onClick={() => handleAdd(cat)} className="px-4 py-2 bg-[#24a0ed] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-600">
                        Add
                      </button>
                      <button onClick={() => setIsAdding(null)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsAdding(cat);
                        setNewItemName("");
                      }}
                      className="mt-4 flex items-center gap-2 text-sm font-bold text-[#24a0ed] hover:text-blue-600 transition-colors p-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPageLayout>
  );
}
