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

export const AlertErrorMedLukkeknapp = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props) => {
        return <AlertMedLukkeknapp variant={'error'} {...props} />;
    }
);

export const AlertSuccessMedLukkeknapp = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props) => {
        return <AlertMedLukkeknapp variant={'success'} {...props} />;
    }
);

const AlertMedLukkeknapp = ({
    children,
    variant,
}: {
    children?: ReactNode;
    variant: AlertProps['variant'];
}) => {
    const [skalVise, settSkalVise] = useState(true);

    useEffect(() => {
        settSkalVise(true);
    }, [children]);

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
AlertErrorMedLukkeknapp.displayName = 'AlertErrorMedLukkeknapp';
AlertSuccessMedLukkeknapp.displayName = 'AlertSuccessMedLukkeknapp';
