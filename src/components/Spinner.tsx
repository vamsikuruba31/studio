import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-t-2 border-b-2",
  {
    variants: {
      variant: {
        primary: "border-primary",
        accent: "border-accent",
        destructive: "border-destructive",
        default: "border-foreground",
      },
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ variant, size, className }: SpinnerProps) {
  return <div className={cn(spinnerVariants({ variant, size, className }))} />;
}
