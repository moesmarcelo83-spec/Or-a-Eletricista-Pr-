
import React, { useState } from 'react';
import { Quote, SelectedService, MaterialItem, ServiceCategory, ServiceDefinition, MaterialDefinition } from '../types';
import { SERVICES_DB } from '../data/services';
import { MATERIALS_DB } from '../data/materials';
import { formatCurrency } from '../utils/format';
import { Trash2, Plus, Search, User, Phone, MapPin, Calculator, Save, X, Lightbulb, Zap, Calendar, AlignLeft, Package, Car } from 'lucide-react';

interface QuoteFormProps {
  onSave: (quote: Quote) => void;
  onCancel: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({ name: '', phone: '', address: '' });
  const [travelFee, setTravelFee] = useState(0);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [observations, setObservations] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialSearchTerm, setMaterialSearchTerm] = useState('');

  const filteredServices = SERVICES_DB.filter(s => 
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = MATERIALS_DB.filter(m =>
    m.description.toLowerCase().includes(materialSearchTerm.toLowerCase())
  );

  const addService = (service: ServiceDefinition) => {
    const newSelected: SelectedService = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: service.id,
      description: service.description,
      quantity: 1,
      unitPrice: service.avgPrice
    };
    setSelectedServices([...selectedServices, newSelected]);
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== id));
  };

  const updateServiceQty = (id: string, qty: number) => {
    setSelectedServices(selectedServices.map(s => s.id === id ? { ...s, quantity: Math.max(1, qty) } : s));
  };

  const updateServicePrice = (id: string, price: number) => {
    setSelectedServices(selectedServices.map(s => s.id === id ? { ...s, unitPrice: price } : s));
  };

  const addMaterialManually = () => {
    const newMaterial: MaterialItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0
    };
    setMaterials([...materials, newMaterial]);
  };

  const addMaterialFromDB = (material: MaterialDefinition) => {
    const newMaterial: MaterialItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: material.description,
      quantity: 1,
      unit: material.unit,
      unitPrice: material.price
    };
    setMaterials([...materials, newMaterial]);
    setMaterialSearchTerm(''); // Clear search after adding
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const calculateTotal = () => {
    const sTotal = selectedServices.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0);
    const mTotal = materials.reduce((acc, m) => acc + (m.quantity * m.unitPrice), 0);
    return sTotal + mTotal + travelFee - discount;
  };

  const handleSave = () => {
    if (!clientData.name) {
      alert("Por favor, informe o nome do cliente.");
      return;
    }
    const quote: Quote = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: clientData.name,
      clientPhone: clientData.phone,
      address: clientData.address,
      date: new Date().toISOString(),
      validUntil: validUntil || undefined,
      services: selectedServices,
      materials,
      observations,
      discount,
      travelFee,
      status: 'pending'
    };
    onSave(quote);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp">
      <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Novo Orçamento</h2>
          <p className="text-blue-100 text-sm">Etapa {step} de 3</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-blue-500 rounded-lg transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Dados do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Nome Completo</label>
                <input 
                  type="text" 
                  value={clientData.name} 
                  onChange={e => setClientData({...clientData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  value={clientData.phone} 
                  onChange={e => setClientData({...clientData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-600">Endereço da Obra</label>
                <input 
                  type="text" 
                  value={clientData.address} 
                  onChange={e => setClientData({...clientData, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Car size={16} className="text-blue-600" />
                  Taxa de Deslocamento (R$)
                </label>
                <input 
                  type="number" 
                  value={travelFee} 
                  onChange={e => setTravelFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calculator size={20} className="text-blue-600" />
                Serviços e Mão de Obra
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar na tabela 2025..."
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="max-h-64 overflow-auto border border-slate-100 rounded-xl bg-slate-50 p-2 space-y-2">
              {filteredServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => addService(service)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">{service.description}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{service.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600">{formatCurrency(service.avgPrice)}</span>
                    <Plus size={18} className="text-slate-300" />
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-600 text-sm uppercase">Serviços Adicionados</h4>
              {selectedServices.length === 0 ? (
                <p className="text-center py-6 text-slate-400 border-2 border-dashed rounded-xl">Nenhum serviço selecionado.</p>
              ) : (
                <div className="space-y-3">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{s.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Qtd</label>
                          <input 
                            type="number" 
                            className="w-full bg-white px-2 py-1 rounded border border-slate-200"
                            value={s.quantity}
                            onChange={e => updateServiceQty(s.id, parseInt(e.target.value))}
                          />
                        </div>
                        <div className="w-28">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Valor Un.</label>
                          <input 
                            type="number" 
                            className="w-full bg-white px-2 py-1 rounded border border-slate-200"
                            value={s.unitPrice}
                            onChange={e => updateServicePrice(s.id, parseFloat(e.target.value))}
                          />
                        </div>
                        <button onClick={() => removeService(s.id)} className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Zap size={20} className="text-orange-500" />
                Materiais Necessários
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar material na base..."
                    className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-64"
                    value={materialSearchTerm}
                    onChange={e => setMaterialSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={addMaterialManually}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-bold whitespace-nowrap"
                >
                  <Plus size={16} /> Item Avulso
                </button>
              </div>
            </div>

            {/* Material Search Results */}
            {materialSearchTerm && (
              <div className="max-h-48 overflow-auto border border-orange-100 rounded-xl bg-orange-50/30 p-2 space-y-1">
                {filteredMaterials.length === 0 ? (
                  <p className="text-center py-4 text-slate-400 text-sm italic">Nenhum material encontrado. Adicione um "Item Avulso".</p>
                ) : (
                  filteredMaterials.map(mat => (
                    <button
                      key={mat.id}
                      onClick={() => addMaterialFromDB(mat)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Package size={14} className="text-orange-400" />
                        <span className="font-medium text-slate-700 text-sm">{mat.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">{mat.unit}</span>
                        <span className="text-sm font-bold text-orange-600">{formatCurrency(mat.price)}</span>
                        <Plus size={16} className="text-orange-300" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="space-y-4">
              {materials.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed">
                  <Lightbulb className="mx-auto mb-2 text-slate-300" size={32} />
                  <p className="text-slate-500">Adicione materiais usando a busca acima ou o botão "Item Avulso".</p>
                </div>
              ) : (
                materials.map(m => (
                  <div key={m.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 md:col-span-6 space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Descrição do Material</label>
                        <input 
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                          value={m.description}
                          onChange={e => updateMaterial(m.id, 'description', e.target.value)}
                          placeholder="Ex: Cabo Flexível 2,5mm Azul"
                        />
                      </div>
                      
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Unidade</label>
                        <select 
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all font-medium text-slate-700"
                          value={m.unit}
                          onChange={e => updateMaterial(m.id, 'unit', e.target.value)}
                        >
                          <option value="un">un</option>
                          <option value="m">m</option>
                          <option value="rolo">rolo</option>
                          <option value="cx">cx</option>
                          <option value="par">par</option>
                          <option value="pct">pct</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>

                      <div className="col-span-4 md:col-span-1.5 space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Qtd</label>
                        <input 
                          type="number"
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                          value={m.quantity}
                          onChange={e => updateMaterial(m.id, 'quantity', parseFloat(e.target.value))}
                        />
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">V. Unitário</label>
                        <input 
                          type="number"
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                          value={m.unitPrice}
                          onChange={e => updateMaterial(m.id, 'unitPrice', parseFloat(e.target.value))}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-0.5 flex justify-end">
                        <button 
                          onClick={() => removeMaterial(m.id)} 
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Remover Item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <AlignLeft size={16} className="text-blue-600" />
                  Observações Adicionais
                </label>
                <textarea 
                  className="w-full p-4 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 leading-relaxed"
                  placeholder="Ex: Prazo de execução: 3 dias úteis.&#10;Condições de pagamento: 50% entrada e 50% na entrega.&#10;Não incluso quebra de alvenaria."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                />
                <p className="text-[10px] text-slate-400">
                  As quebras de linha serão respeitadas na geração do PDF final.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  Prazo de Validade
                </label>
                <input 
                  type="date"
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all font-medium text-slate-700"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Selecione até quando este orçamento é válido para o cliente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-slate-100">
        <div className="text-center md:text-left">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Valor Total Estimado</p>
          <p className="text-3xl font-black text-blue-700">{formatCurrency(calculateTotal())}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-white transition-all"
            >
              Anterior
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all"
            >
              <Save size={20} />
              Gerar Orçamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
