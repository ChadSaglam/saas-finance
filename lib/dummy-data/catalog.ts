import { CatalogItem } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';

export const dummyCatalogItems: CatalogItem[] = [
  {
    id: uuidv4(),
    code: 'DEV-101',
    name: 'Frontend Development',
    description: 'Development of frontend interfaces using React/Next.js',
    type: 'service',
    defaultPrice: 95,
    defaultUnit: 'hours',
    category: 'Development',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'DEV-102',
    name: 'Backend Development',
    description: 'Development of backend APIs and services',
    type: 'service',
    defaultPrice: 110,
    defaultUnit: 'hours',
    category: 'Development',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'CON-215',
    name: 'Business Process Consulting',
    description: 'Analysis and optimization of business processes',
    type: 'service',
    defaultPrice: 150,
    defaultUnit: 'hours',
    category: 'Consulting',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'SUP-300',
    name: 'Premium Support Package',
    description: 'Priority support with guaranteed response time',
    type: 'service',
    defaultPrice: 800,
    defaultUnit: 'month',
    category: 'Support',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'HW-405',
    name: 'Server Hardware - Dell R640',
    description: 'Dell PowerEdge R640 Server - 2x Intel Xeon, 64GB RAM, 2TB SSD',
    type: 'product',
    defaultPrice: 3200,
    defaultUnit: 'pcs',
    category: 'Hardware',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'SW-512',
    name: 'CRM Software Implementation',
    description: 'Implementation and configuration of CRM software solution',
    type: 'product',
    defaultPrice: 1500,
    defaultUnit: 'pcs',
    category: 'Software',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'LIC-610',
    name: 'Enterprise Software License',
    description: 'Annual license for enterprise software suite',
    type: 'product',
    defaultPrice: 120,
    defaultUnit: 'users',
    category: 'Licenses',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: uuidv4(),
    code: 'NET-701',
    name: 'Enterprise Network Switch',
    description: 'Cisco Catalyst 9300 24-port network switch',
    type: 'product',
    defaultPrice: 2200,
    defaultUnit: 'pcs',
    category: 'Network',
    isActive: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  }
];

/**
 * Find a catalog item by its code
 */
export function findCatalogItemByCode(code: string): CatalogItem | undefined {
  return dummyCatalogItems.find(item => item.code === code);
}

/**
 * Find catalog items by category
 */
export function findCatalogItemsByCategory(category: string): CatalogItem[] {
  return dummyCatalogItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
}