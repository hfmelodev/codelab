import { DialogContent, Dialog as DialogRoot, DialogTitle, DialogTrigger } from './primitives'

type DialogProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  title?: string
  children?: React.ReactNode
  content: React.ReactNode
  width?: string
  height?: string
  preventOUtsideClick?: boolean
}

export function Dialog({
  open,
  setOpen,
  title,
  children,
  content,
  width = '600px',
  height = '90vh',
  preventOUtsideClick,
}: DialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        style={{ maxWidth: width, maxHeight: height }}
        className="overflow-y-auto"
        onInteractOutside={event => {
          if (preventOUtsideClick) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
      >
        {title && <DialogTitle>{title}</DialogTitle>}

        {content}
      </DialogContent>
    </DialogRoot>
  )
}
