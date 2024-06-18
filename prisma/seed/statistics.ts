import { Prisma } from "@prisma/client";

export const statisticsData: Prisma.StatisticsCreateInput[] = [
  {
    newBlocks: 300,
    totalBlocks: 300,
    newHashPower: 1000,
    totalHashPower: 1000,
    members: 2,
    issuedAt: new Date("2024-06-13"),
    createdAt: new Date("2024-06-13"),
  },
  {
    newBlocks: 300,
    totalBlocks: 600,
    newHashPower: 1000,
    totalHashPower: 2000,
    members: 2,
    issuedAt: new Date("2024-06-14"),
    createdAt: new Date("2024-06-14"),
  },
  {
    newBlocks: 300,
    totalBlocks: 900,
    newHashPower: 2000,
    totalHashPower: 4000,
    members: 2,
    issuedAt: new Date("2024-06-15"),
    createdAt: new Date("2024-06-15"),
  },
  {
    newBlocks: 300,
    totalBlocks: 1200,
    newHashPower: 3000,
    totalHashPower: 7000,
    members: 2,
    issuedAt: new Date("2024-06-16"),
    createdAt: new Date("2024-06-16"),
  },
]