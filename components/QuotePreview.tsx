
import React from 'react';
import { Quote } from '../types';
import { X, Printer, Zap, Loader2 } from 'lucide-react';

interface QuotePreviewProps {
  quote: Quote;
  pdfUrl: string | null;
  onClose: () => void;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, pdfUrl, onClose }) => {
  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.print();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Visualização do Orçamento</h3>
              <p className="text-xs text-slate-500">Preview do PDF - {quote.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              disabled={!pdfUrl}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Printer size={16} /> Imprimir / Abrir PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 bg-slate-200 relative">
          {!pdfUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="font-medium">Gerando prévia...</p>
            </div>
          ) : (
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          )}
        </div>
        
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            Esta é uma pré-visualização fiel do documento que será enviado ao cliente.
          </p>
        </div>
      </div>
    </div>
  );
};
