import React, { useEffect } from 'react';

import styled from 'styled-components';

import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { useApp } from '../../App/context/AppContext';
import { EToast, toastTilTekst } from '../../App/typer/toast';

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
    width: 16%;
    top: 10%;
    left: 42%;
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
        case EToast.INNGANGSVILKÅR_GJENBRUKT:
            return (
                <ContainerTopMiddle>
                    <AlertStripeSuksess>{toastTilTekst[toast]}</AlertStripeSuksess>
                </ContainerTopMiddle>
            );
        case EToast.BEHANDLING_HENLAGT:
        case EToast.BREVMOTTAKERE_SATT:
        case EToast.TILBAKEKREVING_OPPRETTET:
        case EToast.VEDTAK_UNDERKJENT:
            return (
                <ContainerTopRight>
                    <AlertStripeSuksess>{toastTilTekst[toast]}</AlertStripeSuksess>
                </ContainerTopRight>
            );
        default:
            return null;
    }
};
