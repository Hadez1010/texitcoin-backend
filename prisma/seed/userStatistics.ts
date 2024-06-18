import { Prisma } from "@prisma/client";

export const userStatisticsData: Prisma.UserStatisticsCreateManyInput[] = [
  {
    userId: "",
    blocks: 300,
    hashPower: 500,
    issuedAt: new Date("2024-06-13"),
    createdAt: new Date("2024-06-13"),
  },
  {
    userId: "",
    blocks: 300,
    hashPower: 500,
    issuedAt: new Date("2024-06-14"),
    createdAt: new Date("2024-06-14"),
  },
  {
    userId: "",
    blocks: 300,
    hashPower: 1000,
    issuedAt: new Date("2024-06-15"),
    createdAt: new Date("2024-06-15"),
  },
  {
    userId: "",
    blocks: 300,
    hashPower: 1500,
    issuedAt: new Date("2024-06-16"),
    createdAt: new Date("2024-06-16"),
  }
]