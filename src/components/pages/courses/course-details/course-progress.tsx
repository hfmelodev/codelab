import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatPrice } from '@/lib/utils'
import { Play, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

type CourseProgressProps = {
  course: Course
}

export function CourseProgress({ course }: CourseProgressProps) {
  const hasCourse = true
  const progress = 1

  return (
    <aside className="sticky top-0 max-h-max rounded-2xl bg-muted p-6">
      {hasCourse ? (
        <>
          <h3 className="font-bold text-muted-foreground text-sm">
            Progresso geral
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <Progress value={progress} />
            <p className="font-bold text-muted-foreground text-sm">
              {progress}%
            </p>
          </div>

          <Link passHref href={`/courses/${course.slug}`}>
            <Button className="mt-4 h-auto w-full py-3 font-bold text-white text-xl">
              {progress > 0 ? 'Continuar assistindo' : 'Começar agora'}
              <Play />
            </Button>
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-bold text-2xl">Comece agora por apenas</p>

            {!!course.discountPrice && (
              <p className="-mb-2 font-medium text-muted-foreground line-through">
                {formatPrice(course.price)}
              </p>
            )}

            <p className="font-extrabold text-4xl text-primary">
              {formatPrice(course.discountPrice ?? course.price)}
            </p>

            <Button className="mt-2 h-auto w-full py-3 font-bold text-white text-xl">
              Comprar
              <ShoppingCart />
            </Button>
          </div>
        </>
      )}
    </aside>
  )
}
