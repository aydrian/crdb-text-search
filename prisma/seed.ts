import { PrismaClient } from "@prisma/client";

import heros from "./data/hero_info.json";

const prisma = new PrismaClient();

async function seed() {
  await prisma.hero.createMany({ data: heros });

  console.log("🌱 Seeding complete");
}

seed();
