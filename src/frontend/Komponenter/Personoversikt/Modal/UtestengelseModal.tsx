import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { BodyLong, BodyShort } from '@navikt/ds-react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import MånedÅrVelger from '../../../Felles/Input/MånedÅr/MånedÅrVelger';

const ModalInnhold = styled.div`
    margin-top: 3rem;
`;

const HuskListe = styled.ol`
    margin-top: 0.25rem;
    padding-left: 1.75rem;
`;

export const UtestengelseModal: FC = () => {
    const { axiosRequest, visUtestengModal, settVisUtestengModal } = useApp();
    const [feilmelding, settFeilmelding] = useState<string>();

    const [fraOgMed, settFraOgMed] = useState<string>();
    const [tilOgMed, settTilOgMed] = useState<string>();
    console.log(!!axiosRequest);
    console.log(!!settFeilmelding);

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Utestengelse',
                onClose: () => settVisUtestengModal(false),
                lukkKnapp: true,
                visModal: visUtestengModal,
            }}
        >
            <ModalInnhold>
                <BodyLong spacing={true}>
                    Husk at perioden for utestenging trer i kraft fra og med måneden etter den
                    måneden vedtak om utestenging er fattet.
                </BodyLong>
                <BodyShort>Husk også at det må:</BodyShort>
                <HuskListe>
                    <li>Oppretts notat om utestengelse i Gosys</li>
                    <li>Hvis bruker har løpende stønader manuelt opphøre disse</li>
                    <li>
                        Sendes brev om utestengelse til bruker fra EF Sak frittstående brevutsender
                    </li>
                </HuskListe>
                Periode fra og med: {fraOgMed}
                <MånedÅrVelger
                    antallÅrFrem={2}
                    antallÅrTilbake={1}
                    disabled={false}
                    feilmelding={''}
                    aria-label={'Inntekt fra'}
                    onEndret={(e) => settFraOgMed(e)}
                ></MånedÅrVelger>
                Periode til og med: {tilOgMed}
                <MånedÅrVelger
                    antallÅrFrem={2}
                    antallÅrTilbake={1}
                    disabled={false}
                    feilmelding={''}
                    aria-label={'Inntekt fra'}
                    onEndret={(e) => settTilOgMed(e)}
                ></MånedÅrVelger>
                Ant.mnd ={feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
            </ModalInnhold>
        </UIModalWrapper>
    );
};
