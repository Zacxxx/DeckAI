import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding root DeckAI project payload...');

    // Clean sweep
    await prisma.slide.deleteMany();
    await prisma.designSystem.deleteMany();
    await prisma.project.deleteMany();

    // Create the hardcoded demo project the frontend expects
    const project = await prisma.project.create({
        data: {
            id: 'demo-project-id',
            title: 'DeckAI Premium Launch Demo',
            format: '16:9',
            designSystem: {
                create: {
                    primaryHex: '#10b981',
                    secondaryHex: '#faf8f5',
                    fontFamily: 'Inter, sans-serif',
                    gridBase: 8
                }
            },
            slides: {
                create: [
                    {
                        orderIndex: 0,
                        htmlPayload: '<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #fdfbf7 0%, #e8e4d9 100%);"><h1 style="color: #2c2b29; font-size: 82px; letter-spacing: -2px; font-weight: 500; margin: 0;">Deck AI Core</h1><p style="color: #8b867c; font-size: 24px; margin-top: 16px;">Agent logic offline. Awaiting prompt.</p></div>'
                    }
                ]
            }
        }
    });

    console.log(`Successfully seeded deterministic project: ${project.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
