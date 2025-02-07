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
        username: 'driver2',
        password: hashSync('password', genSaltSync(10)),
        firstName: 'Mang',
        middleName: 'A',
        lastName: 'Tsuper',
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
      {
        username: 'passenger2',
        password: hashSync('password', genSaltSync(10)),
        firstName: 'Pass',
        middleName: 'B',
        lastName: 'Enger',
        roleId: 3,
      },
    ],
  });

  await prisma.dropoff.createMany({
    data: [
      {
        name: 'Villa Montserrat',
        address: 'Villa Montserrat Havila Phase 1',
        longitude: '121.15185416462482',
        latitude: '14.56021890541903',
        status: 'ACTIVE',
        fare: '150.00'
      }
    ]
  })

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
