import { MineStatInput, SaleReportInput } from '@/type';
import { Statistics } from '@/entity/statistics/statistics.entity';
import { CreateStatisticsInput } from '@/entity/statistics/statistics.type';
import { toLocaleDate } from './common';
import { Prisma, PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const getStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput[]
) {
  const statistics: Prisma.StatisticsCreateInput[] = [];
  const salesGroupByDate = {};

  saleReports.map((val) => {
    const date = toLocaleDate(val.date, 'en-CA');
    if (!salesGroupByDate[date]) salesGroupByDate[date] = { hashPower: 0, amount: 0, member: {} };
    salesGroupByDate[date].hashPower += val.hashPower;
    salesGroupByDate[date].amount += val.amount;
    salesGroupByDate[date].member[val.email] =
      (salesGroupByDate[date].member[val.email] || 0) + val.hashPower;
  });

  const prevStatistic = await prisma.statistics.findFirst({
    orderBy: {
      issuedAt: 'desc',
    },
  });

  let totalHashPower = (prevStatistic && prevStatistic.totalHashPower) || 0;

  mineStats.map((val) => {
    const date = toLocaleDate(val.date, 'en-CA');
    totalHashPower += salesGroupByDate[date].hashPower;
    statistics.push({
      issuedAt: new Date(date),
      createdAt: new Date(date),
      newBlocks: val.newBlock,
      totalBlocks: val.totalBlock,
      newHashPower: salesGroupByDate[date].hashPower,
      totalHashPower,
      members: Object.keys(salesGroupByDate[date].member).length,
    });
  });
  return statistics;
};

export const getUserStatistics = async function (
  saleReports: SaleReportInput[],
  mineStats: MineStatInput[]
) {
  const userStatistics: Prisma.UserStatisticsCreateManyInput[] = [];
  const salesGroupByDate = {};

  saleReports.map((val) => {
    const date = toLocaleDate(val.date, 'en-CA');
    if (!salesGroupByDate[date]) salesGroupByDate[date] = { hashPower: 0, amount: 0, member: {} };
    salesGroupByDate[date].hashPower += val.hashPower;
    salesGroupByDate[date].amount += val.amount;
    salesGroupByDate[date].member[val.email] =
      (salesGroupByDate[date].member[val.email] || 0) + val.hashPower;
  });

  let totalHashPower = 0;
  const users: Record<string, string> = {};

  await mineStats.map(async (val) => {
    const date = toLocaleDate(val.date, 'en-CA');
    const members = salesGroupByDate[date].member;

    totalHashPower += salesGroupByDate[date].hashPower;
    for (const member in members) {
      if (users[member] === undefined) {
        const user = await prisma.user.findUnique({ where: { email: member } });
        users[member] = user.id;
      }
      userStatistics.push({
        userId: users[member],
        issuedAt: new Date(date),
        createdAt: new Date(date),
        blocks: (val.newBlock * members[member] * 254) / salesGroupByDate[date].hashPower,
        hashPower: members[member],
      });
    }
  });
  return userStatistics;
};
