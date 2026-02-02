
import { User, CollectionRequest, Product, Inventory, PurchaseRequest, PurchaseOrder, FinanceTransaction } from '../types';

const KEYS = {
  USERS: 'iaeco_users',
  REQUESTS: 'iaeco_requests',
  CURRENT_USER: 'iaeco_session',
  PRODUCTS: 'iaeco_products',
  INVENTORY: 'iaeco_inventory',
  PURCHASE_REQUESTS: 'iaeco_purchase_reqs',
  PURCHASE_ORDERS: 'iaeco_purchase_orders',
  FINANCE: 'iaeco_finance'
};

const defaultUsers: User[] = [
  { id: '1', name: 'Miguel (Gerente)', email: 'miguel@iaeco.com', role: 'admin', status: 'active', points: 0 },
  { id: '2', name: 'Cidadão Exemplo', email: 'user@email.com', role: 'citizen', status: 'active', points: 850 }
];

const defaultProducts: Product[] = [
  { id: 'p1', name: 'Saco 100L Reforçado', description: 'Uso municipal', costPrice: 15.00, salePrice: 25.00, supplierId: 'f1' },
  { id: 'p2', name: 'Luvas Nitrílicas', description: 'EPI Coleta', costPrice: 10.00, salePrice: 20.00, supplierId: 'f2' },
  { id: 'p3', name: 'Container 240L', description: 'Lixeira Rodante', costPrice: 300.00, salePrice: 450.00, supplierId: 'f1' }
];

const defaultInventory: Inventory[] = [
  { productId: 'p1', currentQty: 120, minQty: 50, location: 'Almoxarifado Norte' },
  { productId: 'p2', currentQty: 15, minQty: 40, location: 'Almoxarifado Sul' },
  { productId: 'p3', currentQty: 5, minQty: 10, location: 'Pátio Central' }
];

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(data);
  },
  
  saveUser: (user: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = storage.getUsers().filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  getRequests: (): CollectionRequest[] => {
    const data = localStorage.getItem(KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  saveRequest: (request: CollectionRequest) => {
    const reqs = storage.getRequests();
    reqs.push(request);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(reqs));
  },

  // --- Novos Métodos ERP ---

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(data);
  },

  saveProduct: (p: Product) => {
    const items = storage.getProducts();
    const idx = items.findIndex(i => i.id === p.id);
    if (idx > -1) items[idx] = p; else items.push(p);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(items));
  },

  getInventory: (): Inventory[] => {
    const data = localStorage.getItem(KEYS.INVENTORY);
    if (!data) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(defaultInventory));
      return defaultInventory;
    }
    return JSON.parse(data);
  },

  saveInventoryItem: (item: Inventory) => {
    const items = storage.getInventory();
    const idx = items.findIndex(i => i.productId === item.productId);
    if (idx > -1) items[idx] = item; else items.push(item);
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  },

  getPurchaseRequests: (): PurchaseRequest[] => {
    const data = localStorage.getItem(KEYS.PURCHASE_REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  savePurchaseRequest: (req: PurchaseRequest) => {
    const items = storage.getPurchaseRequests();
    const idx = items.findIndex(i => i.id === req.id);
    if (idx > -1) items[idx] = req; else items.push(req);
    localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(items));
  },

  getPurchaseOrders: (): PurchaseOrder[] => {
    const data = localStorage.getItem(KEYS.PURCHASE_ORDERS);
    return data ? JSON.parse(data) : [];
  },

  savePurchaseOrder: (order: PurchaseOrder) => {
    const items = storage.getPurchaseOrders();
    items.push(order);
    localStorage.setItem(KEYS.PURCHASE_ORDERS, JSON.stringify(items));
  },

  getFinance: (): FinanceTransaction[] => {
    const data = localStorage.getItem(KEYS.FINANCE);
    return data ? JSON.parse(data) : [];
  },

  saveTransaction: (t: FinanceTransaction) => {
    const items = storage.getFinance();
    items.push(t);
    localStorage.setItem(KEYS.FINANCE, JSON.stringify(items));
  }
};
