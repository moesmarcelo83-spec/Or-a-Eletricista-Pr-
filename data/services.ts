
import { ServiceDefinition, ServiceCategory } from '../types';

export const SERVICES_DB: ServiceDefinition[] = [
  // ILUMINAÇÃO
  { id: "i1", category: ServiceCategory.ILUMINACAO, description: "Instalação de Interruptor Simples ou Pulsador", minPrice: 45, maxPrice: 65, avgPrice: 55 },
  { id: "i2", category: ServiceCategory.ILUMINACAO, description: "Instalação de Interruptor Tree-Way ou Four Way", minPrice: 55, maxPrice: 75, avgPrice: 65 },
  { id: "i3", category: ServiceCategory.ILUMINACAO, description: "Instalação de Interruptor Duplo ou Bipolar", minPrice: 55, maxPrice: 75, avgPrice: 65 },
  { id: "i4", category: ServiceCategory.ILUMINACAO, description: "Instalação de Interruptor e Tomada (Juntos)", minPrice: 55, maxPrice: 75, avgPrice: 65 },
  { id: "i5", category: ServiceCategory.ILUMINACAO, description: "Instalação de Arandela, Pendente ou Spot Comum", minPrice: 60, maxPrice: 90, avgPrice: 75 },
  { id: "i6", category: ServiceCategory.ILUMINACAO, description: "Instalação de Lâmpada Fluorescente ou LED (Tubular)", minPrice: 65, maxPrice: 85, avgPrice: 75 },
  { id: "i7", category: ServiceCategory.ILUMINACAO, description: "Instalação de Lustres Simples ou Luminária", minPrice: 85, maxPrice: 110, avgPrice: 97.5 },
  { id: "i8", category: ServiceCategory.ILUMINACAO, description: "Instalação de Lustres Grandes ou Luminária", minPrice: 130, maxPrice: 160, avgPrice: 145 },
  { id: "i9", category: ServiceCategory.ILUMINACAO, description: "Instalação de Refletor de Jardim", minPrice: 95, maxPrice: 125, avgPrice: 110 },
  { id: "i10", category: ServiceCategory.ILUMINACAO, description: "Instalação de Refletor LED + Fotocélula ou Sensor", minPrice: 65, maxPrice: 105, avgPrice: 85 },
  { id: "i11", category: ServiceCategory.ILUMINACAO, description: "Instalação de Perfil de LED (Metro Linear)", minPrice: 150, maxPrice: 190, avgPrice: 170 },

  // PONTO DE UTILIZAÇÃO
  { id: "p1", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Tomada Simples", minPrice: 35, maxPrice: 55, avgPrice: 45 },
  { id: "p2", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Tomada Dupla", minPrice: 45, maxPrice: 65, avgPrice: 55 },
  { id: "p3", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Tomada Tripla", minPrice: 55, maxPrice: 75, avgPrice: 65 },
  { id: "p4", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Tomada Industrial (3P+T)", minPrice: 85, maxPrice: 125, avgPrice: 105 },
  { id: "p5", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Ventilador de Teto", minPrice: 130, maxPrice: 170, avgPrice: 150 },
  { id: "p6", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Chuveiro Elétrico Simples", minPrice: 85, maxPrice: 105, avgPrice: 95 },
  { id: "p7", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Chuveiro Luxo (Eletrônico/Pressurizado)", minPrice: 130, maxPrice: 160, avgPrice: 145 },
  { id: "p8", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Interfone 1 Chamada", minPrice: 140, maxPrice: 210, avgPrice: 175 },
  { id: "p9", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Video Porteiro", minPrice: 170, maxPrice: 210, avgPrice: 190 },
  { id: "p10", category: ServiceCategory.PONTO_UTILIZACAO, description: "Instalação de Portão Eletrônico Deslizante", minPrice: 250, maxPrice: 290, avgPrice: 270 },

  // QUADROS DE DISTRIBUIÇÃO
  { id: "q1", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Substituição de Disjuntor Monofásico", minPrice: 45, maxPrice: 65, avgPrice: 55 },
  { id: "q2", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Instalação de IDR", minPrice: 120, maxPrice: 160, avgPrice: 140 },
  { id: "q3", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Instalação de DPS", minPrice: 105, maxPrice: 135, avgPrice: 120 },
  { id: "q4", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Montagem QDC (6 Circuitos + DR + DPS)", minPrice: 495, maxPrice: 545, avgPrice: 520 },
  { id: "q5", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Montagem QDC (12 Circuitos + DR + DPS)", minPrice: 750, maxPrice: 800, avgPrice: 775 },
  { id: "q6", category: ServiceCategory.QUADROS_DISTRIBUICAO, description: "Montagem QDC (24 Circuitos + DR + DPS)", minPrice: 1260, maxPrice: 1320, avgPrice: 1290 },

  // PASSAGEM DE CABOS
  { id: "c1", category: ServiceCategory.PASSAGEM_CABOS, description: "Entrada Monofásica (QM para QDC)", minPrice: 170, maxPrice: 230, avgPrice: 200 },
  { id: "c2", category: ServiceCategory.PASSAGEM_CABOS, description: "Entrada Bifásica ou Trifásica (QM para QDC)", minPrice: 230, maxPrice: 300, avgPrice: 265 },
  { id: "c3", category: ServiceCategory.PASSAGEM_CABOS, description: "Alimentação para Motores", minPrice: 160, maxPrice: 220, avgPrice: 190 },

  // SOLUÇÃO DE PROBLEMAS
  { id: "s1", category: ServiceCategory.SOLUCAO_PROBLEMAS, description: "Curto Circuito Monofásico", minPrice: 130, maxPrice: 190, avgPrice: 160 },
  { id: "s2", category: ServiceCategory.SOLUCAO_PROBLEMAS, description: "Curto Circuito Bifásico", minPrice: 160, maxPrice: 220, avgPrice: 190 },
  { id: "s3", category: ServiceCategory.SOLUCAO_PROBLEMAS, description: "Curto Circuito Trifásico", minPrice: 185, maxPrice: 255, avgPrice: 220 },

  // PADRÃO DE ENTRADA
  { id: "e1", category: ServiceCategory.PADRAO_ENTRADA, description: "Instalação de Medidor Monofásico 127/220V", minPrice: 1080, maxPrice: 1700, avgPrice: 1390 },
  { id: "e2", category: ServiceCategory.PADRAO_ENTRADA, description: "Instalação de Medidor Bifásico 220V", minPrice: 1290, maxPrice: 1940, avgPrice: 1615 },
  { id: "e3", category: ServiceCategory.PADRAO_ENTRADA, description: "Instalação de Medidor Trifásico 220V", minPrice: 1500, maxPrice: 2150, avgPrice: 1825 },

  // CARREGADOR VEICULAR
  { id: "v1", category: ServiceCategory.CARREGADOR_VEICULAR, description: "Instalação de Carregador Veicular (Residencial Simples)", minPrice: 800, maxPrice: 1200, avgPrice: 1000 },

  // AUTOMAÇÃO RESIDENCIAL
  { id: "a1", category: ServiceCategory.AUTOMACAO_RESIDENCIAL, description: "Instalação de Interruptor Inteligente", minPrice: 110, maxPrice: 270, avgPrice: 190 },
  { id: "a2", category: ServiceCategory.AUTOMACAO_RESIDENCIAL, description: "Instalação Mini Relé Interruptor", minPrice: 160, maxPrice: 270, avgPrice: 215 },
  { id: "a3", category: ServiceCategory.AUTOMACAO_RESIDENCIAL, description: "Configuração Assistente Virtual", minPrice: 110, maxPrice: 210, avgPrice: 160 },
  { id: "a4", category: ServiceCategory.AUTOMACAO_RESIDENCIAL, description: "Instalação Fechadura Inteligente", minPrice: 210, maxPrice: 370, avgPrice: 290 }
];
