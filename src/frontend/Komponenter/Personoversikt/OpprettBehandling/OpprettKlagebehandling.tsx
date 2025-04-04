import React, { useState } from 'react';
import styled from 'styled-components';
import { erFørEllerLikDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button, HStack } from '@navikt/ds-react';
import { KlageGjelderTilbakekreving } from '../Klage/KlageGjelderTilbakekreving';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import { ÅrsakSelect } from './ÅrsakSelect';
import {
    Klagebehandlingsårsak,
    klagebehandlingsårsakerForOpprettelse,
    klagebehandlingsårsakTilTekst,
} from '../../../App/typer/klagebehandlingsårsak';
import { OpprettKlagebehandlingRequest } from '../../../App/typer/klage';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
`;

interface Props {
    settVisModal: (bool: boolean) => void;
    opprettKlagebehandling: (data: OpprettKlagebehandlingRequest) => void;
}

export const OpprettKlagebehandling: React.FunctionComponent<Props> = ({
    settVisModal,
    opprettKlagebehandling,
}) => {
    const { toggles } = useToggles();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtDato, settValgtDato] = useState<string>();
    const [klageGjelderTilbakekreving, settKlageGjelderTilbakekreving] = useState<boolean>(false);
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<
        Klagebehandlingsårsak | undefined
    >(Klagebehandlingsårsak.ORDINÆR);

    const harTilgangTilValgAvAnnenBehandlingsårsak =
        toggles[ToggleName.velgÅrsakVedKlageOpprettelse];

    const harValgtBehandlingsårsakUtenTilgang =
        !harTilgangTilValgAvAnnenBehandlingsårsak &&
        valgtBehandlingsårsak !== Klagebehandlingsårsak.ORDINÆR;

    const validerOgOpprettKlagebehandling = () => {
        settFeilmelding('');
        if (!valgtBehandlingsårsak) {
            settFeilmelding('Vennligst velg en årsak');
        } else if (harValgtBehandlingsårsakUtenTilgang) {
            settFeilmelding(
                'Du har valgt en årsak du ikke har tilgang til å velge. Vennligst meld i fra til brukerstøtte dersom du skal ha tilgang til valg av denne årsaken.'
            );
        } else if (!valgtDato) {
            settFeilmelding('Vennligst velg en dato fra datovelgeren');
        } else if (!erGyldigDato(valgtDato) || !erFørEllerLikDagensDato(valgtDato)) {
            settFeilmelding('Vennligst velg en gyldig dato som ikke er fremover i tid');
        } else {
            opprettKlagebehandling({
                mottattDato: valgtDato,
                behandlingsårsak: valgtBehandlingsårsak,
                klageGjelderTilbakekreving: klageGjelderTilbakekreving,
            });
        }
    };

    return (
        <>
            {harTilgangTilValgAvAnnenBehandlingsårsak && (
                <ÅrsakSelect
                    valgmuligheter={klagebehandlingsårsakerForOpprettelse}
                    valgtBehandlingsårsak={valgtBehandlingsårsak}
                    settValgtBehandlingsårsak={settValgtBehandlingsårsak}
                    årsakTilTekst={klagebehandlingsårsakTilTekst}
                />
            )}
            <Datovelger
                id={'klage-mottatt'}
                label={'Klage mottatt'}
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
                <ModalKnapp variant="primary" onClick={() => validerOgOpprettKlagebehandling()}>
                    Opprett
                </ModalKnapp>
            </HStack>
        </>
    );
};
