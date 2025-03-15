import { IconProps, IconTypes } from '@types';
import { forwardRef } from 'react';
import { ReactSVG } from 'react-svg';

export const Icon = forwardRef<any, IconProps>(
    ({ src, type, ...rest }, ref) => {
        return (
            <ReactSVG
                ref={ref}
                wrapper={'span'}
                src={src ?? IconTypes[type ?? 'frame']}
                {...rest}
            />
        );
    }
);
