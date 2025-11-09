import { PrismaClient } from '@prisma/client';
import { problems } from '../data/problems';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.problem.deleteMany();
  
  console.log('📝 Creating problems...');
  
  // Seed problems
  for (const problemData of problems) {
    await prisma.problem.create({
      data: problemData,
    });
  }
  
  console.log('✅ Database seeded successfully!');
  console.log(`   Created ${problems.length} problems`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });