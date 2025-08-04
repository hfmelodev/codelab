'use server'

import { asaasApi } from '@/lib/asaas'
import { prisma } from '@/lib/prisma'
import { formatName, unMockValue } from '@/lib/utils'
import { ServerError } from '@/server/error'
import { type PixCheckoutSchema, pixCheckoutSchema } from '@/server/schemas/payment'
import { getUser } from './user'

type AsaasApiProps = {
  name: string
  email: string
  cpfCnpj: string
  postalCode: string
  addressNumber: string
}

export async function createPixCheckout(payload: PixCheckoutSchema) {
  const input = pixCheckoutSchema.safeParse(payload)

  if (!input.success) {
    throw new ServerError({
      message: 'Falha ao processar o pagamento',
      code: 'INVALID_DATA',
    })
  }

  const { courseId, name, postalCode: rawPostalCode, addressNumber, cpf: rawCpf } = input.data

  const cpf = unMockValue(rawCpf)
  const postalCode = unMockValue(rawPostalCode)

  const { userId, user } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  })

  if (!course) {
    throw new ServerError({
      message: 'Curso nao encontrado',
      code: 'NOT_FOUND',
    })
  }

  const userHasCourse = await prisma.coursePurchase.findFirst({
    where: {
      userId,
      courseId,
    },
  })

  if (userHasCourse) {
    throw new ServerError({
      message: 'Voce ja possui acesso a esse curso',
      code: 'CONFLICT',
    })
  }

  let customerId = user?.asaasId

  if (!customerId) {
    const { data: newCustomer } = await asaasApi.post('/customers', {
      name: name ?? formatName(user.firstName, user.lastName),
      email: user.email,
      cpfCnpj: cpf,
      postalCode,
      addressNumber,
    } as AsaasApiProps)

    if (!newCustomer) {
      throw new ServerError({
        message: 'Falha ao processar o pagamento',
        code: 'FAILED_TO_CREATE_CUSTOMER',
      })
    }

    customerId = newCustomer.id as string

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        asaasId: customerId,
      },
    })
  }

  const price = course.discountPrice ?? course.price

  const paymentPayload = {
    customer: customerId,
    billingType: 'PIX',
    value: price,
    dueDate: new Date().toISOString().split('T')[0],
    description: `Compra do curso ${course.title}`,
    externalReference: course.id,
  }

  const { data: payment } = await asaasApi.post('/payments', paymentPayload)

  return {
    invoiceId: payment.id as string,
  }
}

export async function getPixQrCode(invoiceId: string) {
  await getUser()

  const { data } = await asaasApi.get(`/payments/${invoiceId}/pixQrCode`)

  return data
}

export async function getInvoiceStatus(invoiceId: string) {
  await getUser()

  const { data } = await asaasApi.get(`/payments/${invoiceId}`)

  return {
    status: data.status as string,
  }
}
