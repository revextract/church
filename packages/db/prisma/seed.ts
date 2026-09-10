import { PrismaClient } from "@prisma/client";
import { emptyData } from "@church/puck-config";

const prisma = new PrismaClient();

async function main() {
  const church = await prisma.church.upsert({
    where: { slug: "grace-chapel" },
    update: {},
    create: { name: "Grace Chapel", slug: "grace-chapel" },
  });

  await prisma.page.upsert({
    where: { churchId_path: { churchId: church.id, path: "/" } },
    update: {},
    create: {
      churchId: church.id,
      path: "/",
      puckJson: {
        ...emptyData,
        content: [
          {
            type: "Hero",
            props: {
              id: "hero-1",
              title: "Welcome to Grace Chapel",
              subtitle: "Join us this Sunday at 9:00 and 11:00 AM.",
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded ${church.name} with a home page.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
