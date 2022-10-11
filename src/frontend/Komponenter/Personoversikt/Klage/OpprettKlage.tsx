import { BehandlingResultat, Fagsak } from '../../../App/typer/fagsak';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { compareDesc } from 'date-fns';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { Normaltekst } from 'nav-frontend-typografi';
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
    fagsak: Fagsak;
    settVisModal: (bool: boolean) => void;
    opprettKlage: (behandlingId: string, mottattDato: string) => void;
}

const behandlingsresultat = [
    BehandlingResultat.AVSLÅTT,
    BehandlingResultat.INNVILGET,
    BehandlingResultat.OPPHØRT,
];
const sisteBehandlingSomErFerdigstilt = (fagsak: Fagsak) =>
    fagsak.behandlinger
        .sort((a, b) => compareDesc(new Date(a.opprettet), new Date(b.opprettet)))
        .find(
            (behandling) =>
                behandling.status === BehandlingStatus.FERDIGSTILT &&
                behandlingsresultat.indexOf(behandling.resultat) > -1
        );

export const OpprettKlage: React.FunctionComponent<IProps> = ({
    fagsak,
    settVisModal,
    opprettKlage,
}) => {
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtDato, settValgtDato] = useState<string>();

    const sisteFerdigstilteBehandlingen = sisteBehandlingSomErFerdigstilt(fagsak);

    if (!sisteFerdigstilteBehandlingen) {
        return (
            <>
                <Normaltekst>Finnes ikke noen ferdigstilt behandling å klage på</Normaltekst>
            </>
        );
    }

    const validerValgtDato = (valgtDato: string | undefined) => {
        settFeilmelding('');
        if (valgtDato && erGyldigDato(valgtDato) && erFørEllerLikDagensDato(valgtDato)) {
            opprettKlage(sisteFerdigstilteBehandlingen.id, valgtDato);
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
                    valgtDato={valgtDato}
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
