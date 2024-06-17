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
    productName: 'Free Share - 500mh/s Power',
    paymentMethod: 'Free_package',
    amount: 0,
    hashPower: 500,
  },
  {
    productName: '(1) Share - 500mh/s Power',
    paymentMethod: 'Free',
    amount: 995,
    hashPower: 500,
  },
  {
    productName: '(2) Share - 1000mh/s Power',
    paymentMethod: 'Register_from_admin',
    amount: 1990,
    hashPower: 1000,
  },
  {
    productName: '(3) Share - 1500mh/s Power',
    paymentMethod: 'Register_from_admin',
    amount: 2985,
    hashPower: 1500,
  }
];
async function main() {
  console.log(`Start seeding ...`);
  let invoiceNo = 1;
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
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
