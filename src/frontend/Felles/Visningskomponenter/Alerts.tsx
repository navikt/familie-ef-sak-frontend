import React, { forwardRef, ReactNode, useEffect, useState } from 'react';
import { Alert, AlertProps, CopyButton, HStack } from '@navikt/ds-react';
import { BodyShortSmall } from './Tekster';
import styled from 'styled-components';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const AlertErrorStyled = styled(Alert)`
    width: fit-content;
`;

export const AlertError = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>((props, ref) => {
    const { toggles } = useToggles();
    const skalBrukeErrorAlertMedKopierKnapp =
        toggles[ToggleName.brukErrorAlertMedKopierKnapp] || false;
    if (skalBrukeErrorAlertMedKopierKnapp) {
        return (
            <AlertErrorStyled variant={'error'} ref={ref}>
                <HStack gap={'1'} align={'center'}>
                    <BodyShortSmall>{props.children}</BodyShortSmall>
                    {props.children && (
                        <CopyButton
                            size={'xsmall'}
                            copyText={props.children.toString()}
                            variant={'action'}
                            activeText={'kopiert'}
                        />
                    )}
                </HStack>
            </AlertErrorStyled>
        );
    }
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
            <Alert size="small" variant={variant} closeButton onClose={() => settSkalVise(false)}>
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
