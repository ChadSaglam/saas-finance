import { CatalogItem } from '@/lib/models';

// Catalog category types
export type ServiceCategory = 'SRV' | 'STR' | 'SEC' | 'DEV' | 'CON' | 'SUP';
export type ProductCategory = 'HW' | 'SW' | 'LIC' | 'NET';
export type CatalogCategory = ServiceCategory | ProductCategory;

// Catalog category definitions with descriptions
export const catalogCategoryDefinitions: Record<CatalogCategory, string> = {
  // Service Categories
  SRV: 'Server-related services',
  STR: 'Storage solutions',
  SEC: 'Security services',
  DEV: 'Development work',
  CON: 'Consulting services',
  SUP: 'Support services',
  // Product Categories
  HW: 'Hardware products',
  SW: 'Software products',
  LIC: 'Licenses',
  NET: 'Network equipment',
};

// Helper functions for catalog codes
export const catalogUtils = {
  /**
   * Generate a catalog code with the given prefix and number
   */
  generateCode: (category: CatalogCategory, number: number): string => {
    return `${category}-${number.toString().padStart(3, '0')}`;
  },
  
  /**
   * Parse a catalog code into its components
   */
  parseCode: (code: string): { category: CatalogCategory, number: number } | null => {
    const match = code.match(/^([A-Z]{3})-(\d{3})$/);
    if (!match) return null;
    
    const category = match[1] as CatalogCategory;
    const number = parseInt(match[2], 10);
    
    return { category, number };
  },
  
  /**
   * Get the category description
   */
  getCategoryDescription: (category: CatalogCategory): string => {
    return catalogCategoryDefinitions[category] || 'Unknown category';
  },
  
  /**
   * Check if the code is a service
   */
  isService: (code: string): boolean => {
    const parsed = catalogUtils.parseCode(code);
    if (!parsed) return false;
    
    const serviceCategories: ServiceCategory[] = ['SRV', 'STR', 'SEC', 'DEV', 'CON', 'SUP'];
    return serviceCategories.includes(parsed.category as ServiceCategory);
  },
  
  /**
   * Check if the code is a product
   */
  isProduct: (code: string): boolean => {
    const parsed = catalogUtils.parseCode(code);
    if (!parsed) return false;
    
    const productCategories: ProductCategory[] = ['HW', 'SW', 'LIC', 'NET'];
    return productCategories.includes(parsed.category as ProductCategory);
  },
  
  /**
   * Get default unit based on category
   */
  getDefaultUnit: (code: string): string => {
    const parsed = catalogUtils.parseCode(code);
    if (!parsed) return 'pcs';
    
    switch (parsed.category) {
      case 'DEV':
      case 'CON':
      case 'SEC':
        return 'hours';
      case 'SUP':
        return 'month';
      case 'LIC':
        return 'users';
      case 'SRV':
      case 'STR':
      default:
        return 'pcs';
    }
  }
};