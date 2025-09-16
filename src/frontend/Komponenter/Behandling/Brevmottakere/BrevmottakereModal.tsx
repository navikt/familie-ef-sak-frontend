import React, { FC, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';
import { SøkWrapper } from './SøkWrapper';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { useApp } from '../../../App/context/AppContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { BrevmottakereListe } from './BrevmottakereListe';
import { EBrevmottakerRolle, IBrevmottaker, IBrevmottakere, IOrganisasjonMottaker } from './typer';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { EToast } from '../../../App/typer/toast';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { AlertError, AlertSuccess } from '../../../Felles/Visningskomponenter/Alerts';

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

const AlertContainer = styled.div`
    margin-top: 1rem;
`;

export const BrevmottakereModal: FC<{
    personopplysninger: IPersonopplysninger;
    mottakere: IBrevmottakere;
    kallSettBrevmottakere: (
        brevmottakere: IBrevmottakere
    ) => Promise<RessursSuksess<string> | RessursFeilet>;
    settVisBrevmottakereModal: (verdi: boolean) => void;
}> = ({ personopplysninger, mottakere, kallSettBrevmottakere, settVisBrevmottakereModal }) => {
    const [valgtePersonMottakere, settValgtePersonMottakere] = useState<IBrevmottaker[]>(
        mottakere.personer
    );
    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        IOrganisasjonMottaker[]
    >(mottakere.organisasjoner);

    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);
    const { settToast } = useApp();

    const initiellePersonIdenter = mottakere.personer.map((mottaker) => mottaker.personIdent);
    const valgtePersonIdenter = valgtePersonMottakere.map((mottaker) => mottaker.personIdent);
    const initielleMottakerRollerPerson = mottakere.personer.map(
        (mottaker) => mottaker.mottakerRolle
    );
    const valgteMottakerRollerPerson = valgtePersonMottakere.map(
        (mottaker) => mottaker.mottakerRolle
    );

    const initielleOrgNumre = mottakere.organisasjoner;
    const initielleMottakerRollerOrganisasjon = mottakere.organisasjoner.map(
        (organisasjon) => organisasjon.mottakerRolle
    );
    const valgteMottakerRollerOrganisasjon = valgteOrganisasjonMottakere.map(
        (organisasjon) => organisasjon.mottakerRolle
    );

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

    const harNyeMottakere = (initelleIdenter: string[], valgteIdenter: string[]) =>
        valgteIdenter.some((identNummer) => !initelleIdenter.includes(identNummer)) ||
        valgteIdenter.length !== initelleIdenter.length;

    const harEndretMottakerRoller = (
        initielleRoller: EBrevmottakerRolle[],
        valgteRoller: EBrevmottakerRolle[]
    ) =>
        initielleRoller.filter((rolle) => rolle === EBrevmottakerRolle.BRUKER).length !==
            valgteRoller.filter((rolle) => rolle === EBrevmottakerRolle.BRUKER).length ||
        initielleRoller.filter((rolle) => rolle === EBrevmottakerRolle.FULLMEKTIG).length !==
            valgteRoller.filter((rolle) => rolle === EBrevmottakerRolle.FULLMEKTIG).length;

    const harNyeOrganisasjoner = (
        initielleOrgNumre: IOrganisasjonMottaker[],
        valgteOrgNumre: IOrganisasjonMottaker[]
    ) => {
        if (initielleOrgNumre.length !== valgteOrgNumre.length) {
            return true;
        }
        const initielleOrganisasjonsNummer = initielleOrgNumre.map(
            (organisasjonsMottaker) => organisasjonsMottaker.organisasjonsnummer
        );
        const initielleNavHosOrganisasjon = initielleOrgNumre.map(
            (organisasjonsMottaker) => organisasjonsMottaker.navnHosOrganisasjon
        );
        return valgteOrgNumre.some(
            (organisasjonsMottaker) =>
                !initielleOrganisasjonsNummer.includes(organisasjonsMottaker.organisasjonsnummer) ||
                !initielleNavHosOrganisasjon.includes(organisasjonsMottaker.navnHosOrganisasjon)
        );
    };

    const harBrevmottakere =
        valgtePersonMottakere.length > 0 || valgteOrganisasjonMottakere.length > 0;

    const mottakerListeHarEndringer =
        harNyeMottakere(initiellePersonIdenter, valgtePersonIdenter) ||
        harEndretMottakerRoller(initielleMottakerRollerPerson, valgteMottakerRollerPerson) ||
        harEndretMottakerRoller(
            initielleMottakerRollerOrganisasjon,
            valgteMottakerRollerOrganisasjon
        ) ||
        harNyeOrganisasjoner(initielleOrgNumre, valgteOrganisasjonMottakere);

    const deaktiverSettMottakere = !harBrevmottakere || !mottakerListeHarEndringer;

    return (
        <ModalWrapper
            tittel={'Hvem skal motta brevet?'}
            visModal={true}
            onClose={() => {
                settVisBrevmottakereModal(false);
            }}
            maxWidth={70}
            ariaLabel={'Velg brevmottakere'}
        >
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
                        valgtePersonMottakere={valgtePersonMottakere}
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
                <Button
                    variant="primary"
                    onClick={settBrevmottakere}
                    disabled={deaktiverSettMottakere}
                >
                    Sett mottakere
                </Button>
            </SentrerKnapper>
            <AlertContainer>
                {feilmelding && <AlertError>{feilmelding}</AlertError>}
                {innsendingSuksess && <AlertSuccess>Brevmottakere er satt</AlertSuccess>}
            </AlertContainer>
        </ModalWrapper>
    );
};
