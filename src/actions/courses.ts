'use server'

import { prisma } from '@/lib/prisma'

type GetCoursesPayload = {
  query?: string
  tags?: string | string[]
}

export async function getCourses({ query, tags: rawTags }: GetCoursesPayload) {
  // Garante que 'tags' seja sempre um array.
  const tags = !rawTags ? [] : Array.isArray(rawTags) ? rawTags : [rawTags]

  const hasTags = !!tags.length
  const hasQuery = !!query?.trim()

  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
      tags: hasTags
        ? {
            // Verifica se dentro do curso alguma tag com o id passado, existe no array 'tags'
            some: {
              id: {
                in: tags,
              },
            },
          }
        : undefined,
      // Verifica se dentro do curso o 'query' existe no título ou na descrição
      OR: hasQuery
        ? [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    },
    include: {
      tags: true,
      modules: true,
    },
    orderBy: {
      // Ordena os cursos por data de criação, os mais recentes primeiro
      createdAt: 'desc',
    },
  })

  return courses
}

export const getCourse = async (
  query: string,
  queryType: 'slug' | 'id' = 'slug'
) => {
  const course = await prisma.course.findUnique({
    where: {
      slug: queryType === 'slug' ? query : undefined,
      id: queryType === 'id' ? query : undefined,
    },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      tags: true,
    },
  })

  return { course }
}
