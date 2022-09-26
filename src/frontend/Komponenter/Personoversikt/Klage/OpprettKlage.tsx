import { BehandlingResultat, Fagsak } from '../../../App/typer/fagsak';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { compareDesc } from 'date-fns';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { Normaltekst } from 'nav-frontend-typografi';
import { erFørDagensDato, erGyldigDato } from '../../../App/utils/dato';

const StyledFamilieDatovelger = styled(FamilieDatovelger)`
    margin-top: 2rem;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    min-height: 400px;
`;

export const StyledHovedknapp = styled(Hovedknapp)`
    margin-left: 2rem;
    margin-right: 0.5rem;
`;

const KnappeWrapper = styled.div`
    margin: 0 auto;
    margin-top: 4rem;
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
    const [feilmelding, settFeilmelding] = useState<string>();
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
        if (valgtDato && erGyldigDato(valgtDato) && erFørDagensDato(valgtDato)) {
            opprettKlage(sisteFerdigstilteBehandlingen.id, valgtDato);
        } else if (!valgtDato) {
            settFeilmelding('Vennligst velg en dato fra datovelgeren');
        } else {
            settFeilmelding('Vennligst velg en gyldig dato som ikke er fremover i tid');
        }
    };

    return (
        <FlexDiv>
            <StyledFamilieDatovelger
                id={'krav-mottatt'}
                label={'Krav mottatt'}
                onChange={(dato) => {
                    settValgtDato(dato as string);
                }}
                valgtDato={valgtDato}
                feil={valgtDato && !erGyldigDato(valgtDato) && 'Ugyldig dato'}
            />

            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
            <KnappeWrapper>
                <StyledHovedknapp onClick={() => validerValgtDato(valgtDato)}>
                    Opprett
                </StyledHovedknapp>
                <Flatknapp
                    onClick={() => {
                        settVisModal(false);
                    }}
                >
                    Avbryt
                </Flatknapp>
            </KnappeWrapper>
        </FlexDiv>
    );
};

export default OpprettKlage;
