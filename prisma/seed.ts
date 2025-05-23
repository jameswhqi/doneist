import { PrismaClient } from '@/prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([prisma.task.deleteMany(), prisma.project.deleteMany()]);

  const p1 = await prisma.project.create({
    data: {
      title: 'see doctor',
      tasks: {
        create: [
          {
            title: 'make appointment',
            date: new Date('2025-05-09')
          },
          {
            title: 'go to hospital',
            date: new Date('2025-05-19')
          }
        ]
      }
    }
  });

  const p2 = await prisma.project.create({
    data: {
      title: 'open bank account',
      tasks: {
        create: [
          {
            title: 'choose a bank',
            date: new Date('2025-05-10')
          },
          {
            title: 'go to the bank'
          }
        ]
      }
    }
  });

  console.log({ p1, p2 });
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