import { Client } from "../models";

export const dummyClients: Client[] = [
  {
    id: "client-001",
    name: "Acme Corporation",
    contactPerson: "John Doe",
    email: "john.doe@acme.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 94001",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-02-20")
  },
  {
    id: "client-002",
    name: "TechStart Inc.",
    contactPerson: "Jane Smith",
    email: "jane.smith@techstart.io",
    phone: "555-987-6543",
    address: "456 Innovation Dr, San Francisco, CA 94107",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-01")
  },
  {
    id: "client-003",
    name: "Global Enterprises",
    contactPerson: "Robert Johnson",
    email: "robert@globalenterprises.com",
    phone: "555-456-7890",
    address: "789 Business Ave, New York, NY 10001",
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-03-10")
  },
  {
    id: "client-004",
    name: "Creative Solutions",
    contactPerson: "Emily Williams",
    email: "emily@creativesolutions.design",
    phone: "555-234-5678",
    address: "321 Design Blvd, Portland, OR 97201",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01")
  },
  {
    id: "client-005",
    name: "Digital Dynamics",
    contactPerson: "Michael Brown",
    email: "michael@digitaldynamics.tech",
    phone: "555-876-5432",
    address: "555 Cyber Street, Austin, TX 78701",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15")
  }
];