import React, { useState } from 'react';
import styled from 'styled-components';
import { erFørEllerLikDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button, HStack } from '@navikt/ds-react';
import { KlageGjelderTilbakekreving } from '../Klage/KlageGjelderTilbakekreving';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
`;

export interface OpprettKlageRequest {
    mottattDato: string;
    klageGjelderTilbakekreving: boolean;
}

interface Props {
    settVisModal: (bool: boolean) => void;
    opprettKlagebehandling: (data: OpprettKlageRequest) => void;
}

export const OpprettKlagebehandling: React.FunctionComponent<Props> = ({
    settVisModal,
    opprettKlagebehandling,
}) => {
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtDato, settValgtDato] = useState<string>();
    const [klageGjelderTilbakekreving, settKlageGjelderTilbakekreving] = useState<boolean>(false);

    const validerOgOpprettKlagebehandling = (valgtDato: string | undefined) => {
        settFeilmelding('');
        if (valgtDato && erGyldigDato(valgtDato) && erFørEllerLikDagensDato(valgtDato)) {
            opprettKlagebehandling({
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
            <KlageGjelderTilbakekreving
                klageGjelderTilbakekreving={klageGjelderTilbakekreving}
                settKlageGjelderTilbakekreving={settKlageGjelderTilbakekreving}
            />
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
            <HStack justify="end" gap="4">
                <ModalKnapp
                    variant="tertiary"
                    onClick={() => {
                        settVisModal(false);
                    }}
                >
                    Avbryt
                </ModalKnapp>
                <ModalKnapp
                    variant="primary"
                    onClick={() => validerOgOpprettKlagebehandling(valgtDato)}
                >
                    Opprett
                </ModalKnapp>
            </HStack>
        </>
    );
};
