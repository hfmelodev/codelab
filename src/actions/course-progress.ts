'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from './user'

type CompleteLessonPayload = {
  courseSlug: string
  lessonId: string
}

export async function markLessonAsCompleted({ courseSlug, lessonId }: CompleteLessonPayload) {
  const { userId } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  })

  if (!course) throw new Error('Course not found')

  // TODO: Verifique se o usuário está matriculado no curso

  // Verifique se a aula ja foi concluida
  const isAlreadyCompleted = await prisma.completedLesson.findFirst({
    where: {
      userId,
      lessonId,
    },
  })

  // Se a aula ja foi concluida, retorne o registro
  if (isAlreadyCompleted) return isAlreadyCompleted

  // Caso contrario, crie um novo registro
  const completedLesson = await prisma.completedLesson.create({
    data: {
      userId,
      lessonId,
      courseId: course.id,
    },
  })

  return completedLesson
}

export async function unmarkLessonAsCompleted(lessonId: string) {
  const { userId } = await getUser()

  const completedLesson = await prisma.completedLesson.findFirst({
    where: {
      lessonId,
      userId,
    },
  })

  if (!completedLesson) return

  await prisma.completedLesson.delete({
    where: {
      id: completedLesson.id,
    },
  })
}

export async function getCourseProgress(courseSlug: string) {
  const { userId } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
    include: {
      modules: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  if (!course) throw new Error('Course not found')

  const completedLessons = await prisma.completedLesson.findMany({
    where: {
      userId,
      courseId: course.id,
    },
  })

  // flatMap => [[], [], []] => [] converte para um array simples []
  const totalLesson = course.modules.flatMap(mod => mod.lessons).length
  const completedLessonsCount = completedLessons.length

  const progress = Math.round((completedLessonsCount / totalLesson) * 100)

  return {
    completedLessons,
    progress,
  }
}
