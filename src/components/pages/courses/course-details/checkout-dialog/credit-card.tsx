'use client'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form/field'
import { InputField } from '@/components/ui/form/input-field'
import { Form } from '@/components/ui/form/primitives'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { creditCardCheckoutFormSchema } from '@/server/schemas/payment'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Cards from 'react-credit-cards-2'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type FormData = z.infer<typeof creditCardCheckoutFormSchema>

type CreditCardFormProps = {
  onBack: () => void
}

export function CreditCardForm({ onBack }: CreditCardFormProps) {
  const form = useForm<FormData>({
    shouldUnregister: true,
    resolver: zodResolver(creditCardCheckoutFormSchema),
    defaultValues: {
      address: '',
      addressNumber: '',
      cardCvv: '',
      cardNumber: '',
      cardValidThru: '',
      cpf: '',
      name: '',
      postalCode: '',
      installments: 1,
      phone: '',
    },
  })

  const { handleSubmit, watch } = form

  const formValues = watch()

  async function onSubmit(data: FormData) {
    console.log(data)
  }

  // TODO: Criar lógica para pegar as opções de parcelamento
  const installmentsOptions = Array.from({ length: 12 }, (_, index) => ({
    label: `${index + 1}x`,
    value: `${index + 1}`,
  }))

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-4">
          <div>
            <Cards
              number={formValues.cardNumber}
              name={formValues.name}
              expiry={formValues.cardValidThru}
              cvc={formValues.cardCvv}
              placeholders={{ name: 'NOME COMPLETO' }}
              locale={{ valid: 'Válido até' }}
              focused={formValues.cardNumber ? 'number' : 'name'}
            />
          </div>

          <div className="grid w-full flex-1 gap-2 sm:grid-cols-2">
            <InputField name="name" placeholder="Nome impresso no cartão" className="col-span-full" />
            <InputField name="cpf" placeholder="CPF do titular" mask="___.___.___-__" />
            <FormField name="phone">
              {({ field }) => (
                <Input
                  {...field}
                  onChange={({ target }) => {
                    const onlyNumbers = target.value.replace(/\D/g, '')
                    field.onChange(onlyNumbers)
                  }}
                  placeholder="Telefone do titular com DDD"
                />
              )}
            </FormField>

            <Separator className="col-span-full my-1 sm:my-2" />

            <InputField name="cardNumber" placeholder="Número do cartão" mask="____ ____ ____ ____" />
            <InputField name="cardValidThru" placeholder="Validade" mask="__/____" />
            <InputField name="cardCvv" placeholder="CVV" mask="___" />
            <FormField name="installments">
              {({ field }) => (
                <Select
                  value={String(field.value)}
                  onChange={value => field.onChange(Number(value))}
                  options={installmentsOptions}
                  placeholder="Quantidade de parcelas"
                />
              )}
            </FormField>

            <Separator className="col-span-full my-1 sm:my-2" />

            <div className="col-span-full grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
              <InputField name="address" placeholder="Endereço (Opcional)" />
              <InputField name="addressNumber" placeholder="Número" />
              <InputField name="postalCode" placeholder="CEP" mask="_____-___" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" type="button" onClick={onBack}>
            <ArrowLeft />
            Voltar
          </Button>

          <Button type="submit">
            Confirmar
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  )
}
