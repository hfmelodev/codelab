import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui/form/input-field'
import { Form } from '@/components/ui/form/primitives'
import { creditCardCheckoutFormSchema } from '@/server/schemas/payment'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type FormData = z.infer<typeof creditCardCheckoutFormSchema>

export function CreditCardForm() {
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

  const { handleSubmit } = form

  async function onSubmit(data: FormData) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-4">
          <div>
            <p>PREVIEW CARTAO</p>
          </div>

          <div className="grid w-full flex-1 gap-2 sm:grid-cols-2">
            <InputField name="cardNumber" label="Número do cartão" />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline">
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
