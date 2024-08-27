import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../App/context/AppContext';
import { EToast, toastTilTekst } from '../../App/typer/toast';
import { AlertMedLukkeknapp } from '../Visningskomponenter/Alerts';

const ContainerTopRight = styled.div`
    z-index: 9999;
    margin: auto;
    position: fixed;
    top: 2%;
    right: 1%;
    transform: translate(0%, 0%);
`;

const ToastAlert: React.FC<{ toast: EToast }> = ({ toast }) => {
    const variant = toast === EToast.REDIRECT_ANNEN_RELASJON_FEILET ? 'error' : 'success';

    return (
        <ContainerTopRight>
            <AlertMedLukkeknapp variant={variant} keyProp={toast}>
                {toastTilTekst[toast]}
            </AlertMedLukkeknapp>
        </ContainerTopRight>
    );
};

export const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 3000);
        return () => clearTimeout(timer);
    });

    if (toast === null || toast === undefined) {
        return null;
    }

    return <ToastAlert toast={toast} />;
};
