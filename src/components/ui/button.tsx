import { cn } from '@lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { ComponentProps } from 'react';

const buttonVariants = cva(
    'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,color,border,box-shadow,opacity] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none',
    {
        variants: {
            variant: {
                default:
                    'bg-inner-primary text-primary shadow-xs hover:bg-inner-secondary',
                destructive:
                    'bg-destructive text-white shadow-xs hover:bg-destructive/90',
                outline:
                    'border bg-none shadow-xs hover:bg-accent hover:border-tertiary',
                secondary:
                    'bg-inner-secondary text-secondary shadow-xs hover:bg-inner-tertiary',
                active: 'bg-inner-primary text-primary shadow-xs',
                text: 'text-secondary shadow-xs hover:text-primary',
                ['text-active']: 'text-primary',
            },
            size: {
                default: 'h-8 text-sm px-3',
                sm: 'h-6 text-xs rounded-md gap-1.5 px-2',
                lg: 'h-10 text-base rounded-md px-6',
                ['icon-sm']: 'text-sm',
                ['icon-md']: 'text-base',
                ['icon-lg']: 'text-2xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    onClick,
    ...props
}: ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    const handleClick: ComponentProps<'button'>['onClick'] = (e) => {
        e.currentTarget.blur();
        onClick?.(e);
    };

    return (
        <Comp
            data-slot='button'
            className={cn(buttonVariants({ variant, size, className }))}
            onClick={handleClick}
            {...props}
        />
    );
}

export { Button, buttonVariants };
