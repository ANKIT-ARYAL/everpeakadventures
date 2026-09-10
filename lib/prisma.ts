import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export const transactionOptions = {
  maxWait: 15_000,
  timeout: 30_000,
};

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15_000,
  });
  return new PrismaClient({
    adapter: new PrismaPg(pool),
    transactionOptions,
  });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Construct the pool only when creating the shared client, including during HMR.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
