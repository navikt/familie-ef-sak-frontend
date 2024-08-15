import React, { useEffect } from 'react';

import styled from 'styled-components';

import { useApp } from '../../App/context/AppContext';
import { EToast, toastTilTekst } from '../../App/typer/toast';
import { AlertError, AlertSuccess } from '../Visningskomponenter/Alerts';

const ContainerTopRight = styled.div`
    z-index: 9999;
    position: fixed;
    right: 2rem;
    top: 4rem;
`;

const ContainerTopMiddle = styled.div`
    z-index: 9999;
    margin: auto;
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, 0%);
`;

export const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    });

    switch (toast) {
        case null:
        case undefined:
            return null;
        case EToast.REDIRECT_ANNEN_RELASJON_FEILET:
            return (
                <ContainerTopMiddle>
                    <AlertError>{toastTilTekst[toast]}</AlertError>
                </ContainerTopMiddle>
            );
        case EToast.INNGANGSVILKÅR_GJENBRUKT:
            return (
                <ContainerTopMiddle>
                    <AlertSuccess>{toastTilTekst[toast]}</AlertSuccess>
                </ContainerTopMiddle>
            );
        case EToast.TILDEL_OPPGAVE_VELlYKKET:
            return (
                <ContainerTopMiddle>
                    <AlertSuccess>{toastTilTekst[toast]}</AlertSuccess>
                </ContainerTopMiddle>
            );
        case EToast.TILDEL_OPPGAVE_FEILET:
            return (
                <ContainerTopMiddle>
                    <AlertError>{toastTilTekst[toast]}</AlertError>
                </ContainerTopMiddle>
            );
        default:
            return (
                <ContainerTopRight>
                    <AlertSuccess>{toastTilTekst[toast]}</AlertSuccess>
                </ContainerTopRight>
            );
    }
};
