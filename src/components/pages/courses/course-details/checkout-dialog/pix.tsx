'use client'

import { createPixCheckout, getInvoiceStatus, getPixQrCode } from '@/actions/payment'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form/field'
import { InputField } from '@/components/ui/form/input-field'
import { Form } from '@/components/ui/form/primitives'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { unMockValue } from '@/lib/utils'
import { pixCheckoutFormSchema } from '@/server/schemas/payment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, ArrowRight, Check, Copy } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormData = z.infer<typeof pixCheckoutFormSchema>

export type PixResponse = {
  encodedImage: string
  payload: string
  expirationDate: string
}

type PixFormProps = {
  onBack: () => void
  onClose: () => void
  course: Course
}

export function PixForm({ onBack, course, onClose }: PixFormProps) {
  const router = useRouter()
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

  const { handleSubmit, watch, setError } = form

  const [isGenerating, setIsGenerating] = useState(true)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [pixData, setPixData] = useState<PixResponse | null>(null)

  const [checkStatusIsDisabled, setCheckStatusIsDisabled] = useState(false)

  const rawCep = watch('postalCode')

  const { mutateAsync: validateCep, isPending: isCheckingCep } = useMutation({
    mutationFn: async () => {
      try {
        const cep = unMockValue(rawCep)

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

        if (response.data.erro) {
          setError('postalCode', {
            type: 'manual',
            message: 'CEP inválido',
          })
          return false
        }

        return true
      } catch {
        setError('postalCode', {
          type: 'manual',
          message: 'Erro ao validar o CEP',
        })

        return false
      }
    },
  })

  const { mutate: handleGetQrCode } = useMutation({
    mutationFn: getPixQrCode,
    onSuccess: data => {
      setPixData(data)
      setIsGenerating(false)
    },
  })

  const { mutateAsync: handleGetStatus, isPending: isGettingStatus } = useMutation({
    mutationFn: getInvoiceStatus,
  })

  const { mutateAsync: handleCreateInvoice, isPending: isCreatingInvoice } = useMutation({
    mutationFn: createPixCheckout,
    onSuccess: response => {
      setStep(2)
      setInvoiceId(response.invoiceId)
      handleGetQrCode(response.invoiceId)
    },
  })

  async function onSubmit(data: FormData) {
    // TODO: Criar lógica para gerar o QR Code validando CEP
    const isValidCep = await validateCep()

    if (!isValidCep) return

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

  function handleCopyToClipboard() {
    if (!pixData) return

    navigator.clipboard.writeText(pixData?.payload)
    toast.success('Copiado para a area de transferência')
  }

  async function handleConfirmPayment() {
    if (!invoiceId) return

    if (checkStatusIsDisabled) {
      toast.error('Aguarde um momento antes de verificar o status do novamente')
      return
    }

    setCheckStatusIsDisabled(true)
    setTimeout(() => setCheckStatusIsDisabled(false), 5000)

    const { status } = await handleGetStatus(invoiceId)

    switch (status) {
      case 'PENDING':
        toast.info(
          'Pagamento em processamento. Caso haja instabilidade poderá levar alguns minutos, mas não se preocupe, o curso será disponível em breve.'
        )
        break
      case 'RECEIVED':
        toast.success('Pagamento efetuado com sucesso!')
        onClose()

        toast.success('Agradecemos por sua compra! Vocẽ será redirecionado para o curso em instantes.')

        await new Promise(resolve => setTimeout(resolve, 4000))

        router.push(`/courses/${course.slug}`)
        break
    }
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
          <>
            <div className="mt-2 flex aspect-square w-[300px] items-center justify-center rounded-xl bg-primary p-3">
              {pixData?.encodedImage && (
                <Image
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="h-full w-full rounded-lg object-contain"
                />
              )}

              {isGenerating && <Skeleton className="w-full flex-1" />}
            </div>

            <p className="my-4 px-12 text-center">
              Escaneie o QR Code com o seu celular ou use o link abaixo para realizar o pagamento.
            </p>

            <div className="flex w-full max-w-[500px gap-2">
              <Input placeholder="Gerando QR Code..." readOnly value={pixData?.payload ?? ''} />
              <Button disabled={!pixData} onClick={handleCopyToClipboard}>
                Copiar
                <Copy />
              </Button>
            </div>
          </>
        )}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant="outline" className="w-full md:w-max" onClick={handleBack} type="button">
            <ArrowLeft />
            Voltar
          </Button>

          {step === 1 ? (
            <Button type="submit" className="w-full md:w-max" disabled={isCreatingInvoice || isCheckingCep}>
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button" disabled={!pixData || isGettingStatus} onClick={handleConfirmPayment}>
              Confirmar pagamento
              <Check />
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
