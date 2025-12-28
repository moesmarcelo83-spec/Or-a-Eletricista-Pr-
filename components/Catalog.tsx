
import React, { useState, useMemo } from 'react';
import { SERVICES_DB } from '../data/services';
import { ServiceCategory } from '../types';
import { formatCurrency } from '../utils/format';
import { Search, Info, Filter, Tag, Hash } from 'lucide-react';

export const Catalog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const categories = Object.values(ServiceCategory);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SERVICES_DB.forEach(service => {
      counts[service.category] = (counts[service.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return SERVICES_DB.filter(s => 
      (activeCategory === 'all' || s.category === activeCategory) &&
      (s.description.toLowerCase().includes(searchLower) || 
       s.category.toLowerCase().includes(searchLower) ||
       s.id.toLowerCase().includes(searchLower))
    );
  }, [activeCategory, search]);

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tabela de Preços 2025</h2>
          <p className="text-slate-500 font-medium">Valores de referência para mão de obra (Engehall).</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
          <Hash size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-800">{filtered.length} serviços encontrados</span>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por serviço, código ou categoria (ex: i1, disjuntor...)"
              className="pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full transition-all text-slate-700 font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category Dropdown (Mobile/Compact) */}
          <div className="relative lg:w-72">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as ServiceCategory | 'all')}
              className="pl-12 pr-10 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full appearance-none transition-all text-slate-700 font-bold cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat} ({categoryCounts[cat] || 0})</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Desktop Quick Filter Buttons */}
        <div className="hidden lg:flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeCategory === 'all' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            Todos <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{SERVICES_DB.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {cat} <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeCategory === cat ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{categoryCounts[cat] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Serviço / Categoria</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Mínimo</th>
                <th className="px-6 py-5 text-xs font-black text-blue-600 uppercase tracking-widest text-center bg-blue-50/30">Média Sugerida</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Máximo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <Search size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Nenhum serviço encontrado com esses filtros.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Tag size={14} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <p className="font-bold text-slate-800 text-sm leading-tight">{s.description}</p>
                             <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{s.id.toUpperCase()}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{s.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-semibold text-slate-500">{formatCurrency(s.minPrice)}</td>
                    <td className="px-6 py-5 text-center text-sm font-black text-blue-700 bg-blue-50/10">{formatCurrency(s.avgPrice)}</td>
                    <td className="px-6 py-5 text-center text-sm font-semibold text-slate-500">{formatCurrency(s.maxPrice)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-200 flex flex-col md:flex-row items-center gap-6 text-white">
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
          <Info className="text-white" size={32} />
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-xl font-bold mb-1">Como usar esta tabela?</h4>
          <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
            Os valores apresentados são <strong>preços médios de mercado para 2025</strong> e referem-se exclusivamente à mão de obra. 
            Utilize o valor <strong>Mínimo</strong> para serviços simples e de rápido acesso, e o <strong>Máximo</strong> para situações de alta complexidade ou infraestrutura antiga.
          </p>
        </div>
      </div>
    </div>
  );
};
