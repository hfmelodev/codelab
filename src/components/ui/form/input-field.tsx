import { InputMask } from '@react-input/mask'
import type { ComponentProps } from 'react'
import { Input } from '../input'
import { FormField } from './field'

type InputFieldProps = ComponentProps<typeof FormField> &
  ComponentProps<typeof Input> & {
    mask?: string
  }

export const InputField = ({ mask, name, className, ...props }: InputFieldProps) => {
  return (
    <FormField name={name} className={className} {...props}>
      {({ field }) =>
        mask ? (
          <InputMask mask={mask} component={Input} replacement={{ _: /\d/ }} {...field} {...props} />
        ) : (
          <Input {...field} {...props} />
        )
      }
    </FormField>
  )
}
