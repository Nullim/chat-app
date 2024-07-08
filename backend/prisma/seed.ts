import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const initialRooms = [
  { name: "Lounge" },
  { name: "Gaming" },
  { name: "Movies" },
  { name: "TV Shows" },
  { name: "Anime" },
  { name: "Food" }
]

const main = async () => {
  await prisma.room.deleteMany()

  for (const room of initialRooms) {
    await prisma.room.create({
      data: room
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
