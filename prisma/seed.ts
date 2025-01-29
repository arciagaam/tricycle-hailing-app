import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const prisma = new PrismaClient();

async function main() {

  await prisma.role.createMany({
    data: [
      {
        name: 'ADMIN'
      },
      {
        name: 'DRIVER'
      },
      {
        name: 'PASSENGER'
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: hashSync('password', genSaltSync(10)),
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        roleId: 1,
      },
      {
        username: 'driver',
        password: hashSync('password', genSaltSync(10)),
        firstName: 'Jane',
        middleName: 'A',
        lastName: 'Doe',
        roleId: 2,
      },
      {
        username: 'passenger',
        password: hashSync('password', genSaltSync(10)),
        firstName: 'Alice',
        middleName: 'B',
        lastName: 'Smith',
        roleId: 3,
      },
    ],
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
