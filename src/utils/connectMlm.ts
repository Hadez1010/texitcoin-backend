import { SaleReportInput } from '@/type';
import { createConnection, Connection } from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import { CreateUserInput } from '@/entity/user/user.type';
import { formatDate } from './common';

const prisma = new PrismaClient();

async function connectToDatabase(): Promise<Connection> {
  const connection = await createConnection({
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  return connection;
}

export const getSales = async () => {
  const connection: Connection = await connectToDatabase();

  const [rows] = await connection.execute(
    'SELECT txc_affiliate.mlm_purchase_history.invoice_no AS invoiceNo, txc_affiliate.mlm_login.username AS username, CONCAT("+", txc_affiliate.mlm_login.phone_code, " ", txc_affiliate.mlm_login.phone) AS mobile, txc_affiliate.mlm_login.email AS email, txc_affiliate.mlm_package.package AS productName, txc_affiliate.mlm_purchase_history.order_date AS issuedAt, txc_affiliate.mlm_purchase_history.payment_method AS paymentMethod, txc_affiliate.mlm_purchase_history.order_amount AS amount, txc_affiliate.mlm_purchase_history.hashpower AS hashPower, txc_affiliate.mlm_login.asset_id AS assetId FROM txc_affiliate.mlm_purchase_history LEFT JOIN txc_affiliate.mlm_login ON txc_affiliate.mlm_purchase_history.order_user_id = txc_affiliate.mlm_login.user_id LEFT JOIN  txc_affiliate.mlm_package ON txc_affiliate.mlm_purchase_history.order_product_id = txc_affiliate.mlm_package.package_id;'
  );

  const data: SaleReportInput[] = rows as SaleReportInput[];

  const users = await prisma.user.findMany();
  const statistics = await prisma.statistics.findMany();

  const userIds = users.reduce((prev, { id, username }) => ({ ...prev, [username]: id }), {});
  const statisticsIds = statistics.reduce(
    (prev, { id, issuedAt }) => ({
      ...prev,
      [formatDate(issuedAt)]: id,
    }),
    {}
  );

  console.log('ids => ', statisticsIds);

  const sales = data.map(({ username, issuedAt, ...rest }) => {
    let statisticsId = statisticsIds[formatDate(issuedAt)];
    if (!statisticsIds[formatDate(issuedAt)]) {
      statisticsId = statistics.length !== 0 && statistics[0].id;
    }

    return {
      userId: userIds[username],
      statisticsId,
      username,
      issuedAt,
      ...rest,
    };
  });

  console.log('sales => ', sales);

  return sales;
};

export const getUsers = async () => {
  const connection: Connection = await connectToDatabase();

  const [rows] = await connection.execute(
    'SELECT username, CONCAT(first_name, " ", last_name) AS fullname, CONCAT("+", phone_code, " ", phone) AS mobile, email, password, primary_address AS address, asset_id AS assetId, TXCpayout AS txcPayout, blockio AS txcCold, join_date AS createdAt FROM txc_affiliate.mlm_login;'
  );

  const users: CreateUserInput[] = rows as CreateUserInput[];

  return users;
};