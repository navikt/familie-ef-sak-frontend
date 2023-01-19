import React, { useState } from 'react';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { erFørEllerLikDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button } from '@navikt/ds-react';

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

interface IProps {
    settVisModal: (bool: boolean) => void;
    opprettKlage: (mottattDato: string) => void;
}

export const OpprettKlage: React.FunctionComponent<IProps> = ({ settVisModal, opprettKlage }) => {
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtDato, settValgtDato] = useState<string>();

    const validerValgtDato = (valgtDato: string | undefined) => {
        settFeilmelding('');
        if (valgtDato && erGyldigDato(valgtDato) && erFørEllerLikDagensDato(valgtDato)) {
            opprettKlage(valgtDato);
        } else if (!valgtDato) {
            settFeilmelding('Vennligst velg en dato fra datovelgeren');
        } else {
            settFeilmelding('Vennligst velg en gyldig dato som ikke er fremover i tid');
        }
    };

    return (
        <>
            <DatoContainer>
                <FamilieDatovelger
                    id={'krav-mottatt'}
                    label={'Krav mottatt'}
                    onChange={(dato) => {
                        settValgtDato(dato as string);
                    }}
                    value={valgtDato}
                    feil={valgtDato && !erGyldigDato(valgtDato) && 'Ugyldig dato'}
                    limitations={{ maxDate: new Date().toISOString() }}
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
