
import React from 'react';
import { PlusCircle, FileText, CheckCircle, Clock, AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import { AppState } from '../types';
import { formatCurrency } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  state: AppState;
  onNewQuote: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onNewQuote }) => {
  const { quotes } = state;

  const totalValue = quotes.reduce((acc, q) => {
    const servicesTotal = q.services.reduce((sAcc, s) => sAcc + (s.quantity * s.unitPrice), 0);
    const materialsTotal = q.materials.reduce((mAcc, m) => mAcc + (m.quantity * m.unitPrice), 0);
    return acc + (servicesTotal + materialsTotal - q.discount);
  }, 0);

  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const approvedQuotes = quotes.filter(q => q.status === 'approved');

  const chartData = [
    { name: 'Jan', value: 4500 },
    { name: 'Fev', value: 3200 },
    { name: 'Mar', value: totalValue > 0 ? totalValue : 1200 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Olá, Profissional!</h2>
          <p className="text-slate-500">Acompanhe seus orçamentos e ganhos para 2025.</p>
        </div>
        <button
          onClick={onNewQuote}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
        >
          <PlusCircle size={20} />
          <span>Novo Orçamento</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Faturamento Total</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalValue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pendentes</p>
            <p className="text-2xl font-bold text-slate-800">{pendingQuotes.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="bg-orange-100 p-4 rounded-xl text-orange-600">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aprovados</p>
            <p className="text-2xl font-bold text-slate-800">{approvedQuotes.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            Desempenho Mensal
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={20} className="text-orange-500" />
            Últimos Orçamentos
          </h3>
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                <p>Nenhum orçamento criado ainda.</p>
              </div>
            ) : (
              quotes.slice(0, 5).map(quote => (
                <div key={quote.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {quote.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{quote.clientName}</p>
                      <p className="text-xs text-slate-500">{new Date(quote.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`
                      text-[10px] uppercase font-bold px-2 py-1 rounded-full
                      ${quote.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        quote.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}
                    `}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
