'use client'

import 'react-credit-cards-2/dist/es/styles-compiled.css'

import { Dialog } from '@/components/ui/dialog'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'

import PixIcon from '@/assets/pix.svg'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CreditCardForm } from './credit-card'
import { PixForm } from './pix'

type CheckoutDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  course: Course
}

const paymentMethods = [
  {
    label: 'Pix',
    value: 'PIX' as const,
    icon: PixIcon,
  },
  {
    label: 'Cartão de crédito',
    value: 'CREDIT_CARD' as const,
    icon: CreditCard,
  },
]

export function CheckoutDialog({ open, setOpen, course }: CheckoutDialogProps) {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX')

  async function handleContinue() {
    // TODO: Validar se o usuário está logado

    setStep(2)
  }

  function handleBack() {
    setStep(1)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      height="95vh"
      title="Concluir compra"
      preventOUtsideClick
      content={
        <div className="pt-4">
          {step === 1 && (
            <div className="flex flex-col">
              <h2 className="mb-3">Selecione o método de pagamento</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {paymentMethods.map(method => (
                  <Button
                    key={method.value}
                    variant="outline"
                    onClick={() => {
                      setPaymentMethod(method.value)
                    }}
                    className={cn(
                      'flex h-auto w-full items-center justify-center gap-3 rounded-xl p-4 font-semibold text-lg disabled:opacity-50',
                      paymentMethod === method.value && '!bg-primary/20 !border-primary text-primary hover:text-primary'
                    )}
                  >
                    <method.icon className="size-6 min-h-6 min-w-6" />
                    {method.label}
                  </Button>
                ))}
              </div>

              <Button className="mt-6 ml-auto w-full" onClick={handleContinue}>
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && paymentMethod === 'CREDIT_CARD' && <CreditCardForm onBack={() => setStep(1)} />}

          {step === 2 && paymentMethod === 'PIX' && <PixForm onBack={handleBack} course={course} onClose={handleClose} />}
        </div>
      }
    />
  )
}
