import { cn } from '@lib/utils';
import { ControlsProps } from '@types';
import { forwardRef } from 'react';

export const Controls = forwardRef<HTMLDivElement, ControlsProps>(
    ({ className, children, ...rest }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'w-[766px] flex flex-col gap-1 bg-card p-3 pb-1 rounded-xl border backdrop-blur-3xl text-primary shadow',
                    className
                )}
                {...rest}
            >
                {children}
            </div>
        );
    }
);
