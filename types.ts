
export enum ServiceCategory {
  ILUMINACAO = "Iluminação",
  PONTO_UTILIZACAO = "Ponto de Utilização",
  QUADROS_DISTRIBUICAO = "Quadros de Distribuição / Painel",
  PASSAGEM_CABOS = "Passagem de Cabos",
  SOLUCAO_PROBLEMAS = "Solução de Problemas Elétricos",
  PADRAO_ENTRADA = "Padrão de Entrada",
  CARREGADOR_VEICULAR = "Carregador Veicular",
  AUTOMACAO_RESIDENCIAL = "Automação Residencial"
}

export interface ServiceDefinition {
  id: string;
  category: ServiceCategory;
  description: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface MaterialDefinition {
  id: string;
  description: string;
  unit: string;
  price: number;
}

export interface MaterialItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface SelectedService {
  id: string;
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  clientName: string;
  clientPhone: string;
  address: string;
  date: string;
  validUntil?: string;
  services: SelectedService[];
  materials: MaterialItem[];
  observations: string;
  discount: number;
  travelFee: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
}

export interface AppState {
  quotes: Quote[];
  activeTab: 'dashboard' | 'quotes' | 'new-quote' | 'catalog';
}
