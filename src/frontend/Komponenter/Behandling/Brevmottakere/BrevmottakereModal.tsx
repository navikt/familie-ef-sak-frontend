import React, { FC, useEffect, useMemo, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';
import { SøkWrapper } from './SøkWrapper';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { BrevmottakereListe } from './BrevmottakereListe';
import { EBrevmottakerRolle, IBrevmottaker, IBrevmottakere, IOrganisasjonMottaker } from './typer';
import styled from 'styled-components';
import Modal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { Button } from '@navikt/ds-react';
import { EToast } from '../../../App/typer/toast';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 100fr 1fr 100fr;
    column-gap: 2rem;
`;
const Venstrekolonne = styled.div``;
const Høyrekolonne = styled.div``;

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;

    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

const StyledModal = styled(Modal)`
    padding: 3rem;
    max-width: 1100px;
`;

const StyledSystemtittel = styled(Systemtittel)`
    margin-bottom: 2rem;
`;

const HorisontalLinje = styled.div`
    height: 0;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

const VertikalLinje = styled.div`
    border-left: 2px solid #f3f3f3;
    width: 5px;
    margin-bottom: 1rem;
`;

export const BrevmottakereModal: FC<{
    personopplysninger: IPersonopplysninger;
    kallSettBrevmottakere: (
        brevmottakere: IBrevmottakere
    ) => Promise<RessursSuksess<string> | RessursFeilet>;
    kallHentBrevmottakere: () => Promise<
        RessursSuksess<IBrevmottakere | undefined> | RessursFeilet
    >;
}> = ({ personopplysninger, kallSettBrevmottakere, kallHentBrevmottakere }) => {
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useApp();
    const initielleBrevmottakere = useMemo(
        () => [
            {
                mottakerRolle: EBrevmottakerRolle.BRUKER,
                personIdent: personopplysninger.personIdent,
                navn: personopplysninger.navn.visningsnavn,
            },
        ],
        [personopplysninger]
    );
    const [valgtePersonMottakere, settValgtePersonMottakere] =
        useState<IBrevmottaker[]>(initielleBrevmottakere);
    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        IOrganisasjonMottaker[]
    >([]);
    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);
    const { settToast } = useApp();

    const settBrevmottakere = () => {
        settFeilmelding('');
        settInnsendingSukksess(false);
        kallSettBrevmottakere({
            personer: valgtePersonMottakere,
            organisasjoner: valgteOrganisasjonMottakere,
        }).then((response: RessursSuksess<string> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                settVisBrevmottakereModal(false);
                settToast(EToast.BREVMOTTAKERE_SATT);
            } else {
                settFeilmelding(response.frontendFeilmelding);
            }
        });
    };

    useEffect(() => {
        const hentBrevmottakere = () => {
            kallHentBrevmottakere().then(
                (resp: RessursSuksess<IBrevmottakere | undefined> | RessursFeilet) => {
                    if (resp.status === RessursStatus.SUKSESS) {
                        if (resp.data) {
                            settValgtePersonMottakere(resp.data.personer);
                            settValgteOrganisasjonMottakere(resp.data.organisasjoner);
                        } else {
                            settValgtePersonMottakere(initielleBrevmottakere);
                            settValgteOrganisasjonMottakere([]);
                        }
                    } else if (resp.status === RessursStatus.FEILET) {
                        settFeilmelding(resp.frontendFeilmelding);
                    }
                }
            );
        };

        if (visBrevmottakereModal) {
            hentBrevmottakere();
        }
    }, [kallHentBrevmottakere, visBrevmottakereModal, initielleBrevmottakere]);

    return (
        <StyledModal
            isOpen={visBrevmottakereModal}
            onRequestClose={() => {
                settVisBrevmottakereModal(false);
            }}
            closeButton={true}
            contentLabel={'Velg brevmottakere'}
        >
            <StyledSystemtittel>Hvem skal motta brevet?</StyledSystemtittel>
            <GridContainer>
                <Venstrekolonne>
                    <VergerOgFullmektigeFraRegister
                        verger={personopplysninger.vergemål}
                        fullmakter={personopplysninger.fullmakt}
                        valgteMottakere={valgtePersonMottakere}
                        settValgteMottakere={settValgtePersonMottakere}
                    />
                    <HorisontalLinje />
                    <SøkWrapper
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                    <HorisontalLinje />
                    <SkalBrukerHaBrev
                        valgteBrevmottakere={valgtePersonMottakere}
                        settValgtBrevMottakere={settValgtePersonMottakere}
                        personopplysninger={personopplysninger}
                    />
                </Venstrekolonne>
                <VertikalLinje />
                <Høyrekolonne>
                    <BrevmottakereListe
                        valgtePersonMottakere={valgtePersonMottakere}
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                </Høyrekolonne>
            </GridContainer>
            <SentrerKnapper>
                <Button variant="tertiary" onClick={() => settVisBrevmottakereModal(false)}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={settBrevmottakere}>
                    Sett mottakere
                </Button>
            </SentrerKnapper>
            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
            {innsendingSuksess && <AlertStripeSuksess>Brevmottakere er satt</AlertStripeSuksess>}
        </StyledModal>
    );
};
