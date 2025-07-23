'use client'

import { createPixCheckout } from '@/actions/payment'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form/field'
import { InputField } from '@/components/ui/form/input-field'
import { Form } from '@/components/ui/form/primitives'
import { Input } from '@/components/ui/input'
import { pixCheckoutFormSchema } from '@/server/schemas/payment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormData = z.infer<typeof pixCheckoutFormSchema>

type PixFormProps = {
  onBack: () => void
  course: Course
}

export function PixForm({ onBack, course }: PixFormProps) {
  const [step, setStep] = useState(1)

  const form = useForm<FormData>({
    shouldUnregister: true,
    resolver: zodResolver(pixCheckoutFormSchema),
    defaultValues: {
      name: '',
      cpf: '',
      postalCode: '',
      addressNumber: '',
    },
  })

  const { handleSubmit } = form

  const { mutateAsync: handleCreateInvoice, isPending: isCreatingInvoice } = useMutation({
    mutationFn: createPixCheckout,
    onSuccess: () => {
      setStep(2)
    },
  })

  async function onSubmit(data: FormData) {
    // TODO: Criar lógica para gerar o QR Code validando CEP

    toast.promise(
      handleCreateInvoice({
        courseId: course.id,
        cpf: data.cpf,
        name: data.name,
        postalCode: data.postalCode,
        addressNumber: data.addressNumber,
      }),
      {
        loading: 'Gerando QR Code...',
        success: 'QR Code gerado com sucesso',
        error: 'Erro ao gerar QR Code',
      }
    )
  }

  function handleBack() {
    if (step === 1) {
      onBack()
      return
    }

    setStep(1)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col items-center" onSubmit={handleSubmit(onSubmit)}>
        {step === 1 ? (
          <div className="w-full">
            <h2 className="mt-2 mb-3 text-center">
              Para gerar o QR Code, por favor informe os dados abaixo
              <span className="block text-sm opacity-50">(Serão utilizados apenas para emissão de nota fiscal)</span>
            </h2>

            <div className="grid w-full gap-2 sm:grid-cols-2">
              <InputField name="name" placeholder="Nome completo" />
              <InputField name="cpf" placeholder="CPF" mask="___.___.___-__" />
              <InputField name="postalCode" placeholder="CEP" mask="_____-___" />
              <FormField name="addressNumber">
                {({ field }) => (
                  <Input
                    {...field}
                    onChange={({ target }) => {
                      const onlyNumbers = target.value.replace(/\D/g, '')
                      field.onChange(onlyNumbers)
                    }}
                    placeholder="Número da residência"
                  />
                )}
              </FormField>
            </div>
          </div>
        ) : (
          <div>
            <p>QR Code do PIX</p>
          </div>
        )}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant="outline" className="w-full md:w-max" onClick={handleBack} type="button">
            <ArrowLeft />
            Voltar
          </Button>

          {step === 1 ? (
            <Button type="submit" className="w-full md:w-max" disabled={isCreatingInvoice}>
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button">
              Confirmar pagamento
              <Check />
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
