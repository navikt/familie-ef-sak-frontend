import React, { FC, useEffect, useMemo, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useBehandling } from '../../../App/context/BehandlingContext';
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

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
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

const StyledSystemtittel = styled(Systemtittel)`
    margin-bottom: 2rem;
`;

const Linje = styled.div`
    height: 0px;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

export const BrevmottakereModal: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ personopplysninger, behandlingId }) => {
    const { axiosRequest } = useApp();
    const { visBrevmottakereModal, settVisBrevmottakereModal } = useBehandling();
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

    const settBrevmottakere = () => {
        settFeilmelding('');
        settInnsendingSukksess(false);
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'POST',
            data: {
                personer: valgtePersonMottakere,
                organisasjoner: valgteOrganisasjonMottakere,
            },
        }).then((response: RessursSuksess<string> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                settInnsendingSukksess(true);
            } else {
                settFeilmelding(response.frontendFeilmelding);
            }
        });
    };

    useEffect(() => {
        const hentBrevmottakere = () => {
            axiosRequest<IBrevmottakere | undefined, null>({
                url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
                method: 'GET',
            }).then((resp: RessursSuksess<IBrevmottakere | undefined> | RessursFeilet) => {
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
            });
        };

        if (visBrevmottakereModal) {
            hentBrevmottakere();
        }
    }, [axiosRequest, behandlingId, visBrevmottakereModal, initielleBrevmottakere]);

    return (
        <Modal
            isOpen={visBrevmottakereModal}
            onRequestClose={() => settVisBrevmottakereModal(false)}
            closeButton={true}
            contentLabel={'Velg brevmottakere'}
        >
            <StyledSystemtittel>Hvem skal motta vedtaksbrevet?</StyledSystemtittel>
            <GridContainer>
                <Venstrekolonne>
                    <VergerOgFullmektigeFraRegister
                        verger={personopplysninger.vergemål}
                        fullmakter={personopplysninger.fullmakt}
                        valgteMottakere={valgtePersonMottakere}
                        settValgteMottakere={settValgtePersonMottakere}
                    />
                    <Linje />
                    <SøkWrapper
                        valgtePersonMottakere={valgtePersonMottakere}
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                    <Linje />
                    <SkalBrukerHaBrev
                        valgteBrevmottakere={valgtePersonMottakere}
                        settValgtBrevMottakere={settValgtePersonMottakere}
                        personopplysninger={personopplysninger}
                    />
                </Venstrekolonne>
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
        </Modal>
    );
};
