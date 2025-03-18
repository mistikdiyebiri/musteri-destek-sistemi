import { PrismaClient } from '@prisma/client';

// PrismaClient global tanımlama
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient singleton örneği oluşturma
// Bu, Next.js hot reload sırasında yeni bağlantıların her seferinde açılmasını engeller
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Geliştirme ortamında global nesneye atama yapalım
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;