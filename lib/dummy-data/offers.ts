import { Offer } from "../models";
import { dummyClients } from "./clients";

export const dummyOffers: Offer[] = [
  {
    id: "offer-001",
    offerNumber: "OFFER-2025-001",
    client: dummyClients[0],
    issueDate: new Date("2025-01-15"),
    validUntil: new Date("2025-02-15"),
    items: [
      {
        id: "item-001",
        code: "DEV-201",
        description: "Website Redesign",
        quantity: 1,
        unit: "pcs",
        price: 4500,
        total: 4500
      },
      {
        id: "item-002",
        code: "DEV-105",
        description: "Content Migration",
        quantity: 1,
        unit: "pcs",
        price: 1000,
        total: 1000
      }
    ],
    subtotal: 5500,
    taxRate: 8.25,
    taxAmount: 453.75,
    total: 5953.75,
    notes: "Offer includes 3 rounds of revisions.",
    status: "accepted",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-25")
  },
  {
    id: "offer-002",
    offerNumber: "OFFER-2025-002",
    client: dummyClients[2],
    issueDate: new Date("2025-02-10"),
    validUntil: new Date("2025-03-10"),
    items: [
      {
        id: "item-003",
        code: "CON-215",
        description: "Strategic Consulting Package",
        quantity: 20,
        unit: "hours",
        price: 400,
        total: 8000
      },
      {
        id: "item-004",
        code: "CON-310",
        description: "Market Analysis Report",
        quantity: 1,
        unit: "pcs",
        price: 2500,
        total: 2500
      }
    ],
    subtotal: 10500,
    taxRate: 8.25,
    taxAmount: 866.25,
    total: 11366.25,
    notes: "Package includes 20 hours of consulting and comprehensive report.",
    status: "sent",
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-10")
  },
  {
    id: "offer-003",
    offerNumber: "OFFER-2025-003",
    client: dummyClients[1],
    issueDate: new Date("2025-03-01"),
    validUntil: new Date("2025-04-01"),
    items: [
      {
        id: "item-005",
        code: "DEV-420",
        description: "Mobile App Development - Full Project",
        quantity: 1,
        unit: "pcs",
        price: 25000,
        total: 25000
      },
      {
        id: "item-006",
        code: "DEV-110",
        description: "App Store Deployment",
        quantity: 1,
        unit: "pcs",
        price: 500,
        total: 500
      },
      {
        id: "item-007",
        code: "SUP-300",
        description: "1 Year Maintenance Plan",
        quantity: 12,
        unit: "months",
        price: 416.67,
        total: 5000
      }
    ],
    subtotal: 30500,
    taxRate: 8.25,
    taxAmount: 2516.25,
    total: 33016.25,
    notes: "Development timeline: 12 weeks. Includes iOS and Android versions.",
    status: "draft",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01")
  },
  {
    id: "offer-004",
    offerNumber: "OFFER-2025-004",
    client: dummyClients[4],
    issueDate: new Date("2025-03-15"),
    validUntil: new Date("2025-04-15"),
    items: [
      {
        id: "item-008",
        code: "HW-405",
        description: "Server Infrastructure Upgrade",
        quantity: 1,
        unit: "pcs",
        price: 12000,
        total: 12000
      },
      {
        id: "item-009",
        code: "SRV-120",
        description: "Migration Services",
        quantity: 25,
        unit: "hours",
        price: 120,
        total: 3000
      },
      {
        id: "item-010",
        code: "TRN-205",
        description: "Staff Training",
        quantity: 10,
        unit: "hours",
        price: 150,
        total: 1500
      }
    ],
    subtotal: 16500,
    taxRate: 8.25,
    taxAmount: 1361.25,
    total: 17861.25,
    notes: "Implementation can begin within 2 weeks of acceptance.",
    status: "sent",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15")
  },
  {
    id: "offer-005",
    offerNumber: "OFFER-2025-005",
    client: dummyClients[3],
    issueDate: new Date("2025-03-20"),
    validUntil: new Date("2025-04-20"),
    items: [
      {
        id: "item-011",
        code: "DES-301",
        description: "Complete Brand Identity Package",
        quantity: 1,
        unit: "pcs",
        price: 7500,
        total: 7500
      },
      {
        id: "item-012",
        code: "DES-210",
        description: "Social Media Kit",
        quantity: 1,
        unit: "pcs",
        price: 2000,
        total: 2000
      }
    ],
    subtotal: 9500,
    taxRate: 8.25,
    taxAmount: 783.75,
    total: 10283.75,
    notes: "Includes logo, color palette, typography, and brand guidelines.",
    status: "rejected",
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-30")
  }
];