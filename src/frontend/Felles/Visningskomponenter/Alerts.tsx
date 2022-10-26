import React, { forwardRef } from 'react';
import { Alert, AlertProps } from '@navikt/ds-react';

export const AlertError = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>((props, ref) => {
    return <Alert variant={'error'} {...props} ref={ref} />;
});

export const AlertSuccess = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props, ref) => {
        return <Alert variant={'success'} {...props} ref={ref} />;
    }
);

export const AlertInfo = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>((props, ref) => {
    return <Alert variant={'info'} {...props} ref={ref} />;
});
export const AlertWarning = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props, ref) => {
        return <Alert variant={'warning'} {...props} ref={ref} />;
    }
);
