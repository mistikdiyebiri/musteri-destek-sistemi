import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@musteridestek.com';
  
  // Mevcut admin kullanıcısını kontrol et
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!existingAdmin) {
    // Admin kullanıcısı yoksa oluştur
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin kullanıcısı oluşturuldu');
  } else {
    console.log('Admin kullanıcısı zaten mevcut');
  }

  // Örnek departmanlar
  const departments = [
    { name: 'Teknik Destek' },
    { name: 'Satış' },
    { name: 'Finans' },
  ];

  for (const dept of departments) {
    const existing = await prisma.department.findFirst({
      where: {
        name: dept.name,
      },
    });

    if (!existing) {
      await prisma.department.create({
        data: dept,
      });
      console.log(`${dept.name} departmanı oluşturuldu`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });