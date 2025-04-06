import { Invoice } from "../models";
import { dummyClients } from "./clients";

export const dummyInvoices: Invoice[] = [
  {
    id: "invoice-001",
    invoiceNumber: "INV-2025-001",
    client: dummyClients[0],
    issueDate: new Date("2025-02-01"),
    dueDate: new Date("2025-03-03"),
    items: [
      {
        id: "item-001",
        code: "DEV-101",
        description: "Website Development",
        quantity: 40,
        unit: "hours",
        price: 87.50,
        total: 3500
      },
      {
        id: "item-002",
        code: "MKT-103",
        description: "SEO Setup",
        quantity: 1,
        unit: "pcs",
        price: 800,
        total: 800
      }
    ],
    subtotal: 4300,
    taxRate: 8.25,
    taxAmount: 354.75,
    total: 4654.75,
    notes: "Thank you for your business!",
    status: "paid",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-03-05")
  },
  {
    id: "invoice-002",
    invoiceNumber: "INV-2025-002",
    client: dummyClients[1],
    issueDate: new Date("2025-02-15"),
    dueDate: new Date("2025-03-17"),
    items: [
      {
        id: "item-003",
        code: "DEV-420",
        description: "Mobile App Development - Phase 1",
        quantity: 1,
        unit: "pcs",
        price: 10000,
        total: 10000
      }
    ],
    subtotal: 10000,
    taxRate: 8.25,
    taxAmount: 825,
    total: 10825,
    notes: "First phase of mobile app development project",
    status: "sent",
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-15")
  },
  {
    id: "invoice-003",
    invoiceNumber: "INV-2025-003",
    client: dummyClients[2],
    issueDate: new Date("2025-03-01"),
    dueDate: new Date("2025-03-31"),
    items: [
      {
        id: "item-004",
        code: "CON-215",
        description: "Consulting Services - March",
        quantity: 15,
        unit: "hours",
        price: 200,
        total: 3000
      },
      {
        id: "item-005",
        code: "CON-310",
        description: "Strategy Document",
        quantity: 1,
        unit: "pcs",
        price: 1500,
        total: 1500
      }
    ],
    subtotal: 4500,
    taxRate: 8.25,
    taxAmount: 371.25,
    total: 4871.25,
    status: "draft",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01")
  },
  {
    id: "invoice-004",
    invoiceNumber: "INV-2025-004",
    client: dummyClients[3],
    issueDate: new Date("2025-03-10"),
    dueDate: new Date("2025-04-09"),
    items: [
      {
        id: "item-006",
        code: "DES-101",
        description: "Logo Design",
        quantity: 1,
        unit: "pcs",
        price: 1200,
        total: 1200
      },
      {
        id: "item-007",
        code: "DES-205",
        description: "Brand Guidelines",
        quantity: 1,
        unit: "pcs",
        price: 800,
        total: 800
      },
      {
        id: "item-008",
        code: "DES-305",
        description: "Marketing Materials",
        quantity: 1,
        unit: "pcs",
        price: 1500,
        total: 1500
      }
    ],
    subtotal: 3500,
    taxRate: 8.25,
    taxAmount: 288.75,
    total: 3788.75,
    status: "overdue",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-04-10")
  },
  {
    id: "invoice-005",
    invoiceNumber: "INV-2025-005",
    client: dummyClients[4],
    issueDate: new Date("2025-03-25"),
    dueDate: new Date("2025-04-24"),
    items: [
      {
        id: "item-009",
        code: "SRV-100",
        description: "Server Maintenance (Monthly)",
        quantity: 1,
        unit: "month",
        price: 500,
        total: 500
      },
      {
        id: "item-010",
        code: "STR-205",
        description: "Cloud Storage Upgrade",
        quantity: 1,
        unit: "pcs",
        price: 300,
        total: 300
      },
      {
        id: "item-011",
        code: "SEC-350",
        description: "Security Audit",
        quantity: 1,
        unit: "pcs",
        price: 1200,
        total: 1200
      }
    ],
    subtotal: 2000,
    taxRate: 8.25,
    taxAmount: 165,
    total: 2165,
    notes: "Monthly IT services package.",
    status: "sent",
    createdAt: new Date("2025-03-25"),
    updatedAt: new Date("2025-03-25")
  }
];