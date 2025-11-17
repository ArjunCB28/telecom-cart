import { Item } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ItemService - Exposes items that are already created back-office
 * Items are loaded from a mock JSON file
 */
class ItemService {
  private items: Map<string, Item> = new Map();

  constructor() {
    this.loadItems();
  }

  /**
   * Load items from mock JSON file
   */
  private loadItems(): void {
    try {
      // Resolve path relative to project root (works in both dev and production)
      const projectRoot = process.cwd();
      const itemsPath = path.join(projectRoot, 'src', 'data', 'items.json');
      
      const itemsData = fs.readFileSync(itemsPath, 'utf-8');
      const items: Item[] = JSON.parse(itemsData);

      // Convert array to Map for efficient lookup
      items.forEach(item => {
        this.items.set(item.itemId, item);
      });
    } catch (error) {
      console.error('Error loading items from mock file:', error);
      // Fallback to empty items if file cannot be loaded
      this.items = new Map();
    }
  }

  /**
   * Get an item by ID
   */
  getItem(itemId: string): Item | null {
    return this.items.get(itemId) || null;
  }

  /**
   * Check if an item exists
   */
  itemExists(itemId: string): boolean {
    return this.items.has(itemId);
  }

  /**
   * Get all available items
   */
  getAllItems(): Item[] {
    return Array.from(this.items.values());
  }

  /**
   * Validate item structure
   */
  validateItem(itemId: string): { valid: boolean; error?: string } {
    if (!itemId || typeof itemId !== 'string') {
      return { valid: false, error: 'Item ID is required and must be a string' };
    }

    if (!this.itemExists(itemId)) {
      return { valid: false, error: `Item with ID ${itemId} does not exist` };
    }

    return { valid: true };
  }
}

export const itemService = new ItemService();

