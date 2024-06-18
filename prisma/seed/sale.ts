import { Prisma } from "@prisma/client";

export const saleData: Prisma.SaleCreateManyInput[] = [
  {
    userId: null,
    statisticsId: null,
    productName: 'Free Share - 500mh/s Power',
    paymentMethod: 'Free_package',
    amount: 0,
    hashPower: 500,
    issuedAt: new Date("2024-06-13"),
    createdAt: new Date("2024-06-13"),
  },
  {
    userId: null,
    statisticsId: null,
    productName: '(1) Share - 500mh/s Power',
    paymentMethod: 'Free',
    amount: 995,
    hashPower: 500,
    issuedAt: new Date("2024-06-14"),
    createdAt: new Date("2024-06-14"),
  },
  {
    userId: null,
    statisticsId: null,
    productName: '(2) Share - 1000mh/s Power',
    paymentMethod: 'Register_from_admin',
    amount: 1990,
    hashPower: 1000,
    issuedAt: new Date("2024-06-15"),
    createdAt: new Date("2024-06-15"),
  },
  {
    userId: null,
    statisticsId: null,
    productName: '(3) Share - 1500mh/s Power',
    paymentMethod: 'Register_from_admin',
    amount: 2985,
    hashPower: 1500,
    issuedAt: new Date("2024-06-16"),
    createdAt: new Date("2024-06-16"),
  }
];