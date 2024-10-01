import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // await prisma.group.create({
  //   data: {
  //     title: 'Corporate',
  //     description: 'Top level coporate division.',
  //   },
  // })

  // await prisma.person.create({
  //   data: {
  //     name: 'Roderick Snel',
  //     email: 'roderick.snel@gmail.com',
  //     memberships: {
  //       create: [{ groupId: 1, role: 'owner' }],
  //     },
  //   },
  // })

  await prisma.process.create({
    data: {
      title: 'Employee onboarding',
      description: 'Typical employee onboarding process.',
      group: {
        connect: { id: 1 },
      },
    },
  })

  await prisma.uncertainty.create({
    data: {
      title: 'Conflict of interest',
      description: 'The employee could have a conflict of interest.',
      type: 'risk',
      impact: 0,
      frequency: 0,
      process: { connect: { id: 1 } },
      controls: {
        create: [
          {
            title: 'Ask the employee',
            description:
              'Ask the employee if there may be a conflict of interest.',
            type: 'preventive',
            effectiveness: 0,
          },
          {
            title: 'Background check',
            description:
              'Do a background check to detect any potential conflict of interest.',
            type: 'preventive',
            effectiveness: 0,
          },
          {
            title: 'Registration of disclosures',
            description:
              'Ensure that employees are prompted to register disclosures.',
            type: 'detective',
            effectiveness: 0,
          },
        ],
      },
    },
  })

  const allGroups = await prisma.group.findMany({
    include: {
      memberships: {
        include: {
          person: true,
        },
      },
    },
  })
  console.dir(allGroups, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
