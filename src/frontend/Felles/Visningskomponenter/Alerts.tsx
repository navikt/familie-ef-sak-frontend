import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
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

export const AlertMedLukkeknapp = ({
    variant,
    children,
    keyProp,
}: {
    variant: AlertProps['variant'];
    children: ReactNode;
    keyProp: string;
}) => {
    const [skalVise, settSkalVise] = useState(true);

    useEffect(() => {
        settSkalVise(true);
    }, [keyProp]);

    return (
        skalVise && (
            <Alert variant={variant} closeButton onClose={() => settSkalVise(false)}>
                {children}
            </Alert>
        )
    );
};

AlertError.displayName = 'AlertError';
AlertSuccess.displayName = 'AlertSuccess';
AlertInfo.displayName = 'AlertInfo';
AlertWarning.displayName = 'AlertWarning';
AlertMedLukkeknapp.displayName = 'AlertMedLukkeknapp';
