type Course = import('../../prisma/generated/prisma').Course
type CourseTag = import('../../prisma/generated/prisma').CourseTag
type CourseModule = import('../../prisma/generated/prisma').CourseModule
type CourseLesson = import('../../prisma/generated/prisma').CourseLesson

type CourseWithTagsAndModules = Course & {
  tags: CourseTag[]
  modules: CourseModule[]
}

type CourseModuleWithLessons = CourseModule & {
  lessons: CourseLesson[]
}
