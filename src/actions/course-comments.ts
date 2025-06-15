'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from './user'

type CreateLessonCommentPayload = {
  courseSlug: string
  lessonId: string
  content: string
  parentId?: string
}

export async function createLessonComment({ courseSlug, lessonId, content, parentId }: CreateLessonCommentPayload) {
  const { userId } = await getUser()

  if (content.length > 500) {
    throw new Error('Comentário deve ter no máximo 500 caracteres')
  }

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  })

  if (!course) throw new Error('Curso não encontrado')

  // TODO: Verificar se o usuário possui o curso

  const lesson = await prisma.courseLesson.findUnique({
    where: {
      id: lessonId,
    },
  })

  if (!lesson) throw new Error('Aula não encontrada')

  const comment = await prisma.lessonComment.create({
    data: {
      content,
      userId,
      lessonId,
      parentId,
    },
  })

  // TODO: Notificar o autor da aula

  return comment
}
