import { SaleService } from '@/entity/sale/sale.service';
import { CreateSaleInput } from '@/entity/sale/sale.type';
import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'james',
    fullname: 'James Reynolds',
    sponsorName: 'BlackRifle',
    introducerFullName: 'Rob Reynolds',
    mobile: '+1 5052121515',
    assetId: 'oVPDrB',
    commissionPayout: '$USDT Wallet Address',
    txcPayout: '$TXC-Cold',
    txcCold: 'ToVPDrBvSUFrdZasJrz9EXmdENBrt2g3bb',
    email: 'vitovodenko@gmail.com',
    password: hashSync('123456789', 12),
    isAdmin: false,
  },
  {
    username: 'finix',
    fullname: 'Golden Finix',
    mobile: '+1 9478861998',
    assetId: 'OvpdRb',
    commissionPayout: '$USDT Wallet Address',
    txcPayout: '$TXC-Cold',
    txcCold: 'ToVPDrBvSUFrdZasJrz9EXmdENBrt2g3bb',
    email: 'goldenfinix@outlook.com',
    password: hashSync('123456789', 12),
    isAdmin: true,
  },
];
const saleData: Prisma.SaleCreateManyInput[] = [
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
const statisticsData: Prisma.StatisticsCreateInput[] = [
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
const userStatisticsData: Prisma.UserStatisticsCreateManyInput[] = [
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
    for (const u of userStatisticsData)
      u.userId = user.id;
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
