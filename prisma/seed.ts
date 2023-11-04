import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const enteties = ['User', 'Role', 'Permission'];
    const actions = ['Create', 'FindAll', 'FindOne', 'Update', 'Remove'];
    for (const entity of enteties) {
        for (const action of actions) {
            const name = `${entity.toLowerCase()}_${action.toLowerCase()}`;
            const description = `${entity} ${action}`;
            await prisma.permission.upsert({
                where: { name },
                create: {
                    name,
                    description,
                    roles: {
                        connectOrCreate: {
                            create: {
                                name: 'admin',
                                description: 'Administrator',
                            },
                            where: { name: 'admin' },
                        },
                    },
                },
                update: {
                    name,
                    description,
                },
            });
        }
    }
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
