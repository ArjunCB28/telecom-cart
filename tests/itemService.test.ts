import { itemService } from '../src/services/itemService';

describe('ItemService - Main Paths', () => {
  test('should return all available items', () => {
    const items = itemService.getAllItems();
    
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('itemId');
    expect(items[0]).toHaveProperty('name');
    expect(items[0]).toHaveProperty('price');
  });

  test('should get item by ID', () => {
    const item = itemService.getItem('item-001');
    
    expect(item).toBeDefined();
    expect(item?.itemId).toBe('item-001');
    expect(item?.price).toBeGreaterThan(0);
  });

  test('should validate existing item', () => {
    const validation = itemService.validateItem('item-001');
    
    expect(validation.valid).toBe(true);
  });
});
