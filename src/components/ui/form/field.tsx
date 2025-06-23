import type { Control, ControllerFieldState, ControllerRenderProps } from 'react-hook-form'

import { Input } from '../input'
import { FormControl, FormField as FormFieldPrimitive, FormItem, FormLabel, FormMessage } from './primitives'

export type FormFieldProps = {
  name: string
  label?: string
  required?: boolean
  className?: string
  control?: Control<any, any>
  children?: (params: {
    field: ControllerRenderProps<any, any>
    fieldState: ControllerFieldState
  }) => React.ReactNode
}

export function FormField({ name, label, className, control, children, ...props }: FormFieldProps) {
  return (
    <FormFieldPrimitive
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>{children ? children({ field, fieldState }) : <Input {...field} {...props} id={name} />}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
