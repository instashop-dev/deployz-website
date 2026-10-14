import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-[15px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:border-border disabled:bg-muted disabled:text-subtle aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-black",
        outline: "border-border-strong bg-background text-foreground hover:bg-surface-subtle active:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-hover hover:decoration-current",
      },
      size: {
        default: "min-h-11 px-5",
        sm: "min-h-9 px-3.5 text-sm",
        lg: "min-h-12 px-6",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
