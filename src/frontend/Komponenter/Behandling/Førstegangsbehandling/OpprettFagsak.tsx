import React, { useEffect, useState } from 'react';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import { erAvTypeFeil, RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { FamilieSelect } from '../../../Felles/Input/FamilieSelect';

const AlertInfoPreWrap = styled(AlertInfo)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const Container = styled.div`
    margin: 1rem;
    max-width: 45rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StønadstypeSelect = styled(FamilieSelect)`
    width: 12rem;
`;

interface Props {
    fagsakPersonId: string;
    hentFagsakPerson: (fagsakPersonId: string) => void;
    personIdent: string;
}

export const OpprettFagsak: React.FC<Props> = ({
    fagsakPersonId,
    hentFagsakPerson,
    personIdent,
}) => {
    const { fagsakPåPersonIdent: fagsak, hentFagsakPåPersonIdent: opprettFagsak } = useHentFagsak();
    const [stønadstype, settStønadstype] = useState<Stønadstype>();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);

    const validerInnsending = (): string => (stønadstype ? '' : 'Må velge stønadstype');

    const bekreftValg = () => {
        settFeilmelding('');
        const feilmelding = validerInnsending();
        if (!feilmelding && !laster && stønadstype) {
            settLaster(true);
            opprettFagsak(personIdent, stønadstype);
        } else {
            settFeilmelding(feilmelding);
        }
    };

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            hentFagsakPerson(fagsakPersonId);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(fagsak.frontendFeilmelding);
            settLaster(false);
        }
    }, [fagsak, fagsakPersonId, hentFagsakPerson]);

    return (
        <Container>
            <Heading size={'medium'} level={'1'}>
                Opprett fagsak manuelt
            </Heading>
            <AlertInfoPreWrap>
                <BodyLong>
                    Denne funksjonen brukes hvis du skal sende brev til en bruker som ikke har
                    fagsak.
                </BodyLong>
                <BodyLong>
                    Dette kan for eksempel være hvis du skal innhente opplysninger for å vurdere
                    retten til overgangsstønad når bruker har søkt om tilleggsstønader.
                </BodyLong>
            </AlertInfoPreWrap>
            <BodyLong>Velg stønadstype for å opprette en fagsak</BodyLong>
            <StønadstypeSelect
                value={stønadstype || ''}
                label={'Velg stønadstype'}
                onChange={(e) => settStønadstype(e.target.value as Stønadstype)}
            >
                <option value="">Velg stønadstype</option>
                {Object.values(Stønadstype).map((stønadstype) => (
                    <option value={stønadstype} key={stønadstype}>
                        {stønadstypeTilTekst[stønadstype]}
                    </option>
                ))}
            </StønadstypeSelect>
            <div>
                <Button onClick={bekreftValg} type="button">
                    Gå videre
                </Button>
            </div>
            {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
        </Container>
    );
};
