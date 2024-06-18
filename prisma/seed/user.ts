import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

export const userData: Prisma.UserCreateInput[] = [
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
