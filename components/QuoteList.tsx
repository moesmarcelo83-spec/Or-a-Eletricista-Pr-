
import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { Search, Trash2, Download, ExternalLink, Filter, CheckCircle, Clock, XCircle, Eye, Share2, Loader2, AlertTriangle } from 'lucide-react';
import { QuotePreview } from './QuotePreview';
import { ShareModal } from './ShareModal';
import { generateQuotePDF } from '../utils/pdfGenerator';

interface QuoteListProps {
  quotes: Quote[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Quote['status']) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({ quotes, onDelete, onUpdateStatus }) => {
  const [filter, setFilter] = useState('');
  const [selectedPreviewQuote, setSelectedPreviewQuote] = useState<Quote | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [selectedShareQuote, setSelectedShareQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const filtered = quotes.filter(q => 
    q.clientName.toLowerCase().includes(filter.toLowerCase()) ||
    q.address.toLowerCase().includes(filter.toLowerCase())
  );

  const calculateQuoteTotal = (q: Quote) => {
    const sTotal = q.services.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0);
    const mTotal = q.materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
    return sTotal + mTotal + (q.travelFee || 0) - q.discount;
  };

  const handleDownloadPDF = async (quote: Quote) => {
    setIsGenerating(quote.id);
    try {
      await generateQuotePDF(quote, true);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleOpenPreview = async (quote: Quote) => {
    setSelectedPreviewQuote(quote);
    setPreviewPdfUrl(null);
    try {
      const url = await generateQuotePDF(quote, false);
      if (url) {
        setPreviewPdfUrl(url as string);
      }
    } catch (error) {
      console.error('Erro ao gerar prévia:', error);
      alert('Não foi possível carregar a prévia.');
      setSelectedPreviewQuote(null);
    }
  };

  // Cleanup blob URL when modal closes
  useEffect(() => {
    if (!selectedPreviewQuote && previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
  }, [selectedPreviewQuote, previewPdfUrl]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Meus Orçamentos</h2>
          <p className="text-slate-500">Gerencie suas propostas enviadas aos clientes.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nome ou endereço..."
            className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
            <Filter className="mx-auto mb-2 text-slate-200" size={48} />
            <p className="text-slate-400">Nenhum orçamento encontrado.</p>
          </div>
        ) : (
          filtered.map(quote => (
            <div key={quote.id} className={`bg-white p-5 rounded-2xl shadow-sm border ${quote.status === 'cancelled' ? 'border-red-100 bg-red-50/10' : 'border-slate-100'} hover:shadow-md transition-shadow group`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`
                      w-2 h-2 rounded-full
                      ${quote.status === 'approved' ? 'bg-emerald-500' : 
                        quote.status === 'pending' ? 'bg-orange-500' : 
                        quote.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-400'}
                    `} />
                    <h3 className={`font-bold text-lg leading-tight ${quote.status === 'cancelled' ? 'text-red-700' : 'text-slate-800'}`}>
                      {quote.clientName}
                    </h3>
                    {quote.status === 'cancelled' && (
                      <AlertTriangle size={18} className="text-red-500 animate-pulse" title="Orçamento Cancelado" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(quote.date)}</span>
                    <span className={`flex items-center gap-1 font-medium ${quote.status === 'cancelled' ? 'text-red-600' : 'text-slate-700'}`}>
                      {formatCurrency(calculateQuoteTotal(quote))}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-md">
                    <ExternalLink size={12} /> {quote.address || 'Sem endereço informado'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <div className="flex bg-slate-50 rounded-lg p-1">
                    <button 
                      onClick={() => onUpdateStatus(quote.id, 'pending')}
                      className={`p-1.5 rounded-md transition-all ${quote.status === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-orange-500'}`}
                      title="Marcar como pendente"
                    >
                      <Clock size={16} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(quote.id, 'approved')}
                      className={`p-1.5 rounded-md transition-all ${quote.status === 'approved' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-500'}`}
                      title="Aprovar orçamento"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(quote.id, 'cancelled')}
                      className={`p-1.5 rounded-md transition-all ${quote.status === 'cancelled' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-red-500'}`}
                      title="Cancelar orçamento"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSelectedShareQuote(quote)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Compartilhar"
                    >
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={() => onDelete(quote.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                      onClick={() => handleOpenPreview(quote)}
                      title="Ver Prévia PDF"
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button 
                      disabled={isGenerating === quote.id}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDownloadPDF(quote)}
                      title="Download PDF"
                    >
                      {isGenerating === quote.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quote Preview Modal */}
      {selectedPreviewQuote && (
        <QuotePreview 
          quote={selectedPreviewQuote} 
          pdfUrl={previewPdfUrl}
          onClose={() => setSelectedPreviewQuote(null)} 
        />
      )}

      {/* Share Modal */}
      {selectedShareQuote && (
        <ShareModal 
          quote={selectedShareQuote} 
          onClose={() => setSelectedShareQuote(null)} 
        />
      )}
    </div>
  );
};
