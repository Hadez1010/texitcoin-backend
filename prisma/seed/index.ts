import { PrismaClient } from '@prisma/client';
import { statisticsData } from './statistics';
import { saleData } from './sale';
import { userData } from './user';
import { userStatisticsData } from './userStatistics';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  let invoiceNo = 1;

  for (let i = 0; i < 4; i++) {
    const s = await prisma.statistics.create({ data: statisticsData[i] });
    saleData[i].statisticsId = s.id;
  }
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });

    for (const u of userStatisticsData) u.userId = user.id;
    await prisma.userStatistics.createMany({ data: userStatisticsData });

    for (const s of saleData) {
      s.userId = user.id;
      s.invoiceNo = invoiceNo;
      invoiceNo++;
    }

    const sale = await prisma.sale.createMany({ data: saleData });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
