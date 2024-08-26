import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useApp } from '../../App/context/AppContext';
import { EToast, toastTilTekst } from '../../App/typer/toast';
import { AlertError, AlertSuccess } from '../Visningskomponenter/Alerts';

const ContainerTopMiddle = styled.div`
    z-index: 9999;
    margin: auto;
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 0%);
`;

const ToastAlert: React.FC<{ toast: EToast }> = ({ toast }) => {
    const Alert = toast === EToast.REDIRECT_ANNEN_RELASJON_FEILET ? AlertError : AlertSuccess;

    return (
        <ContainerTopMiddle>
            <Alert>{toastTilTekst[toast]}</Alert>
        </ContainerTopMiddle>
    );
};

export const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    }, [settToast]);

    if (toast === null || toast === undefined) {
        return null;
    }

    return <ToastAlert toast={toast} />;
};
