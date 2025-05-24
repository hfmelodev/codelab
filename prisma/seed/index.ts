import { PrismaClient } from '../generated/prisma'
import sampleCourses from '../sample-courses.json'

const prisma = new PrismaClient()

async function main() {
  for (const courseData of sampleCourses) {
    const { tags, modules, ...course } = courseData

    const createdCourse = await prisma.course.create({
      data: {
        ...course,
        status: 'PUBLISHED',
        tags: {
          connectOrCreate: tags.map(name => ({
            where: { name },
            create: { name },
          })),
        },
        modules: {
          create: modules.map((courseModule, index) => ({
            title: courseModule.title,
            description: courseModule.description,
            // +1 porque o index começa em 0
            order: index + 1,
            lessons: {
              create: courseModule.lessons.map((lesson, index) => ({
                title: lesson.title,
                description: lesson.description,
                videoId: lesson.videoId,
                durationInMs: lesson.durationInMs,
                // +1 porque o index começa em 0
                order: index + 1,
              })),
            },
          })),
        },
      },
    })

    console.log(`Created course: ${createdCourse.title}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
