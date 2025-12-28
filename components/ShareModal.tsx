
import React from 'react';
import { Quote } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { X, Send, Mail, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  quote: Quote;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ quote, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const servicesTotal = quote.services.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0);
  const materialsTotal = quote.materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
  const total = servicesTotal + materialsTotal - quote.discount;

  const quoteSummary = `*Orçamento de Serviços Elétricos - Orça Pro*%0A%0A` +
    `*Cliente:* ${quote.clientName}%0A` +
    `*Data:* ${formatDate(quote.date)}%0A` +
    `*Local:* ${quote.address || 'Não informado'}%0A%0A` +
    `*Total:* ${formatCurrency(total)}%0A%0A` +
    `_Gerado por Orça Eletricista Pro_`;

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${quoteSummary}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = `Orçamento Elétrico - ${quote.clientName}`;
    const body = decodeURIComponent(quoteSummary.replace(/\*/g, '').replace(/%0A/g, '\n'));
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const handleCopy = () => {
    const text = decodeURIComponent(quoteSummary.replace(/\*/g, '').replace(/%0A/g, '\n'));
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Send size={18} className="text-blue-600" />
            Compartilhar Orçamento
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-500 text-center mb-4">
            Envie o resumo do orçamento para o cliente <strong>{quote.clientName}</strong>.
          </p>

          <button 
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
          >
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">WhatsApp</p>
              <p className="text-xs text-slate-500">Enviar mensagem direta</p>
            </div>
          </button>

          <button 
            onClick={handleEmail}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">E-mail</p>
              <p className="text-xs text-slate-500">Enviar via correio eletrônico</p>
            </div>
          </button>

          <button 
            onClick={handleCopy}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all group ${copied ? 'bg-emerald-50 border-emerald-200' : 'border-slate-100 hover:bg-slate-50'}`}
          >
            <div className={`p-3 rounded-lg transition-colors ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white'}`}>
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">{copied ? 'Copiado!' : 'Copiar Texto'}</p>
              <p className="text-xs text-slate-500">Resumo formatado para clipboard</p>
            </div>
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
