import { getCourse } from '@/actions/courses'
import { CourseProgress } from '@/components/pages/courses/course-details/course-progress'
import { BackButton } from '@/components/shared/back-button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatDifficulty, formatDuration } from '@/lib/utils'
import { format } from 'date-fns'
import {
  Calendar1,
  CameraIcon,
  ChartColumnIncreasingIcon,
  CirclePlay,
  Clock1,
  LayoutDashboard,
} from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

type CourseDetailsPageProsp = {
  params: Promise<{
    slug: string
  }>
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProsp) {
  const { slug } = await params

  const { course } = await getCourse(slug)

  if (!course) return notFound()

  const totalDuration = course.modules.reduce((acc, module) => {
    return (
      acc +
      module.lessons.reduce((acc, lesson) => {
        return acc + lesson.durationInMs
      }, 0)
    )
  }, 0)

  const totalLessons = course.modules.reduce((acc, module) => {
    return acc + module.lessons.length
  }, 0)

  const details = [
    {
      icon: Clock1,
      label: 'Duração',
      value: formatDuration(totalDuration),
    },
    {
      icon: CameraIcon,
      label: 'Aulas',
      value: `${totalLessons} aulas`,
    },
    {
      icon: ChartColumnIncreasingIcon,
      label: 'Dificuldade',
      value: formatDifficulty(course.difficulty),
    },
    {
      icon: Calendar1,
      label: 'Data de publicação',
      value: format(course.createdAt, 'dd/MM/yyyy'),
    },
  ]

  return (
    <section className="flex flex-col">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <BackButton />

          <h1 className="mt-6 font-bold text-3xl sm:text-4xl">
            {course.title}
          </h1>

          {course.description && (
            <p className="mt-1 text-muted-foreground">{course.description}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {course.tags.map(tag => (
              <Badge key={tag.id} variant="outline" className="border-primary">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Image
          src={course.thumbnail}
          alt={course.title}
          width={300}
          height={400}
          className="aspect-video w-full rounded-2xl border border-primary object-cover md:w-auto"
        />
      </div>

      <Separator className="my-6" />

      <div className="grid w-full gap-10 md:grid-cols-[1fr_400px]">
        <Tabs defaultValue="overview">
          <TabsList className="w-full md:max-w-[300px]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:text-primary!"
            >
              <LayoutDashboard />
              Visão geral
            </TabsTrigger>

            <TabsTrigger
              value="content"
              className="data-[state=active]:text-primary!"
            >
              <CirclePlay />
              Conteúdo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <p className="mt-4 opacity-50">{course.description}</p>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-6">
              {details.map(detail => (
                <div key={detail.label} className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <detail.icon size={20} />
                  </div>

                  <div>
                    <p className="font-medium text-muted-foreground text-sm">
                      {detail.label}
                    </p>
                    <p>{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-4 flex flex-col gap-6">
            {course.modules.map((mod, index) => (
              <div
                key={mod.id}
                className="flex items-center gap-4 rounded-2xl bg-muted p-4"
              >
                <div
                  className={cn(
                    'flex size-12 min-w-12 items-center justify-center border-2 border-primary',
                    'rounded-full bg-primary/10 font-bold text-2xl text-primary'
                  )}
                >
                  {index + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold sm:text-xl">{mod.title}</p>
                    <Badge variant="outline" className="border-primary">
                      {mod.lessons.length} aula
                      {mod.lessons.length > 1 && 's'}
                    </Badge>
                  </div>

                  {!!mod.description && (
                    <p className="mt-1 text-muted-foreground text-sm sm:text-base">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <CourseProgress course={course} />
      </div>
    </section>
  )
}
