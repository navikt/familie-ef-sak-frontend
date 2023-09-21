import React, { useState } from 'react';
import styled from 'styled-components';
import { erFørEllerLikDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button } from '@navikt/ds-react';
import KlageGjelderTilbakekreving from '../../Journalføring/KlageGjelderTilbakekreving';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const DatoContainer = styled.div`
    margin-top: 2rem;
    margin-bottom: 18rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 1rem;
`;

export interface OpprettKlageRequest {
    mottattDato: string;
    klageGjelderTilbakekreving: boolean;
}

interface IProps {
    settVisModal: (bool: boolean) => void;
    opprettKlage: (data: OpprettKlageRequest) => void;
}

export const OpprettKlage: React.FunctionComponent<IProps> = ({ settVisModal, opprettKlage }) => {
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtDato, settValgtDato] = useState<string>();
    const [klageGjelderTilbakekreving, settKlageGjelderTilbakekreving] = useState<boolean>(false);

    const validerValgtDato = (valgtDato: string | undefined) => {
        settFeilmelding('');
        if (valgtDato && erGyldigDato(valgtDato) && erFørEllerLikDagensDato(valgtDato)) {
            opprettKlage({
                mottattDato: valgtDato,
                klageGjelderTilbakekreving: klageGjelderTilbakekreving,
            });
        } else if (!valgtDato) {
            settFeilmelding('Vennligst velg en dato fra datovelgeren');
        } else {
            settFeilmelding('Vennligst velg en gyldig dato som ikke er fremover i tid');
        }
    };

    return (
        <>
            <KlageGjelderTilbakekreving
                klageGjelderTilbakekreving={klageGjelderTilbakekreving}
                settKlageGjelderTilbakekreving={settKlageGjelderTilbakekreving}
            />
            <DatoContainer>
                <Datovelger
                    id={'krav-mottatt'}
                    label={'Krav mottatt'}
                    settVerdi={(dato) => {
                        settValgtDato(dato as string);
                    }}
                    verdi={valgtDato}
                    feil={valgtDato && !erGyldigDato(valgtDato) ? 'Ugyldig dato' : undefined}
                    maksDato={new Date()}
                />
                {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
            </DatoContainer>
            <ButtonContainer>
                <ModalKnapp
                    variant="tertiary"
                    onClick={() => {
                        settVisModal(false);
                    }}
                >
                    Avbryt
                </ModalKnapp>
                <ModalKnapp variant="primary" onClick={() => validerValgtDato(valgtDato)}>
                    Opprett
                </ModalKnapp>
            </ButtonContainer>
        </>
    );
};

export default OpprettKlage;
