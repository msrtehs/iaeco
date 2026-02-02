
export type ViewState = 'home' | 'chat' | 'request' | 'admin' | 'iptu' | 'login' | 'users' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'citizen';
  status: 'active' | 'inactive';
  points: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: {
    label: string;
    action: string;
  }[];
}

export interface WasteAnalysis {
  category: string;
  recommendation: string;
  destination: string;
  confidence: number;
}

export interface CollectionRequest {
  id: string;
  userId: string;
  itemDescription: string;
  category: string;
  status: 'Pendente' | 'Recebido' | 'Em Rota' | 'Concluído';
  date: string;
}

// --- Schema de Gestão Empresarial ---

export interface Product {
  id: string;
  name: string;
  description: string;
  costPrice: number; // preço_custo
  salePrice: number; // preço_venda
  supplierId: string; // fornecedor_id
}

export interface Inventory {
  productId: string;
  currentQty: number; // quantidade_atual
  minQty: number; // quantidade_minima (ponto de pedido)
  location: string; // localizacao
}

export interface PurchaseRequest {
  id: string;
  productId: string;
  suggestedQty: number; // quantidade_sugerida
  status: 'Pendente' | 'Aprovado' | 'Comprado';
  createdAt: string; // data_criacao
}

export interface PurchaseOrder {
  id: string;
  supplierId: string; // fornecedor_id
  totalValue: number; // valor_total
  orderDate: string; // data_pedido
  deliveryStatus: 'Pendente' | 'Enviado' | 'Entregue'; // status_entrega
}

export interface FinanceTransaction {
  id: string;
  type: 'Despesa' | 'Receita';
  value: number; // valor
  category: string; // categoria
  date: string; // data
  referenceOrderId?: string; // referencia_pedido_id
}
