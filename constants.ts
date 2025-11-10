
import type { Product } from './types';
import { StockStatus } from './types';

export const INITIAL_INVENTORY: Product[] = [
  { sku: 'JW-BLACK-750', name: 'Johnnie Walker Black Label', category: 'Whisky', quantity: 150, location: 'Warehouse A', status: StockStatus.IN_STOCK, price: 35.99 },
  { sku: 'SMIRNOFF-RED-1L', name: 'Smirnoff No. 21 Vodka', category: 'Vodka', quantity: 200, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 18.50 },
  { sku: 'BAILEYS-ORIG-750', name: 'Baileys Original Irish Cream', category: 'Liqueur', quantity: 80, location: 'Warehouse A', status: StockStatus.IN_STOCK, price: 24.00 },
  { sku: 'CM-SPICED-1L', name: 'Captain Morgan Spiced Gold', category: 'Rum', quantity: 45, location: 'Warehouse C', status: StockStatus.LOW_STOCK, price: 21.99 },
  { sku: 'TANQUERAY-LON-750', name: 'Tanqueray London Dry Gin', category: 'Gin', quantity: 60, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 28.75 },
  { sku: 'GUINNESS-DRAFT-6PK', name: 'Guinness Draught Stout', category: 'Beer', quantity: 300, location: 'Cold Storage A', status: StockStatus.IN_STOCK, price: 9.99 },
  { sku: 'KETEL-ONE-750', name: 'Ketel One Vodka', category: 'Vodka', quantity: 0, location: 'Warehouse C', status: StockStatus.OUT_OF_STOCK, price: 32.50 },
  { sku: 'BULLEIT-BOURBON-750', name: 'Bulleit Bourbon', category: 'Whisky', quantity: 35, location: 'Warehouse A', status: StockStatus.LOW_STOCK, price: 45.00 },
  { sku: 'DON-JULIO-BL-750', name: 'Don Julio Blanco Tequila', category: 'Tequila', quantity: 70, location: 'Warehouse B', status: StockStatus.IN_STOCK, price: 55.20 },
  { sku: 'CROWN-ROYAL-DLX-750', name: 'Crown Royal Deluxe', category: 'Whisky', quantity: 120, location: 'Warehouse C', status: StockStatus.IN_STOCK, price: 30.00 },
];
