'use client'

import { createLessonComment } from '@/actions/course-comments'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { queryKeys } from '@/constants/query-keys'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const commentInputFormSchema = z.object({
  content: z.string().min(1, 'Comentário é obrigatório').max(500, 'Comentártio deve ter no máximo 500 caracteres'),
})

type commentInputFormType = z.infer<typeof commentInputFormSchema>

export function CommentInput() {
  const { user } = useUser()
  const params = useParams<{ slug: string; lessonId: string }>()

  const lessonId = params.lessonId
  const courseSlug = params.slug

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<commentInputFormType>({
    resolver: zodResolver(commentInputFormSchema),
    defaultValues: {
      content: '',
    },
  })

  const queryClient = useQueryClient()
  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: createLessonComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonComments(lessonId),
      })

      reset()

      toast.success('Comentário criado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao criar comentário')
    },
  })

  async function handleFormContent(data: commentInputFormType) {
    createComment({ courseSlug, lessonId, content: data.content })
  }

  return (
    <form className="flex gap-4" onSubmit={handleSubmit(handleFormContent)}>
      <Avatar src={user?.imageUrl} fallback={user?.fullName} />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <Textarea placeholder="Deixe seu comentário..." className="min-h-[100px]" {...field} disabled={isCreatingComment} />
        )}
      />

      <Button type="submit">Comentar</Button>
    </form>
  )
}
