const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const resolvedDatabaseUrl = databaseUrl.startsWith('file:./')
  ? `file:${path.resolve(__dirname, '..', '..', databaseUrl.slice('file:./'.length)).replace(/\\/g, '/')}`
  : databaseUrl;

const adapter = new PrismaBetterSqlite3({
  url: resolvedDatabaseUrl,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
