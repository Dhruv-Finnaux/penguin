import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react"

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      default: "size-5",
      sm: "size-4",
      lg: "size-8",
    },
    variant: {
      default: "text-current",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}
export const Spinner = ({ size, className }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }), className)} />
}
