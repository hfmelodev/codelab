type Course = import('../../prisma/generated/prisma').Course
type CourseTag = import('../../prisma/generated/prisma').CourseTag
type CourseModule = import('../../prisma/generated/prisma').CourseModule
type CourseLesson = import('../../prisma/generated/prisma').CourseLesson
type CompletedLesson = import('../../prisma/generated/prisma').CompletedLesson
type LessonComment = import('../../prisma/generated/prisma').LessonComment
type User = import('../../prisma/generated/prisma').User

type CourseWithTagsAndModules = Course & {
  tags: CourseTag[]
  modules: CourseModule[]
}

type CourseModuleWithLessons = CourseModule & {
  lessons: CourseLesson[]
}

type CourseWithModulesAndLessons = Course & {
  modules: CourseModuleWithLessons[]
}

type LessonCommentWithUserAndReplies = LessonComment & {
  user: User
  replies?: LessonCommentWithUserAndReplies[]
}
