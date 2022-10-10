import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import {
    byggSuksessRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useDebouncedCallback } from 'use-debounce';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AlertStripeFeil, AlertStripeSuksess } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import {
    AvsnittMedId,
    FritekstBrevContext,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IFrittståendeBrev,
} from './BrevTyper';
import {
    flyttAvsnittNedover,
    flyttAvsnittOppover,
    initielleAvsnittMellomlager,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
} from './BrevUtils';
import BrevInnhold from './BrevInnhold';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { BrevmottakereModal } from '../Brevmottakere/BrevmottakereModal';
import { EBrevmottakerRolle, IBrevmottakere } from '../Brevmottakere/typer';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const StyledBrev = styled.div`
    margin-bottom: 10rem;
    width: inherit;
`;

const ModalKnapper = styled.div`
    margin-top: 1rem;
    width: 70%;
    display: flex;
    justify-content: space-between;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-top: 1rem;
`;

type Props = {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    fagsakId: string;
    mellomlagretFrittståendeBrev?: IFrittståendeBrev;
    personopplysninger: IPersonopplysninger;
};

const FrittståendeBrev: React.FC<Props> = ({
    oppdaterBrevressurs,
    fagsakId,
    mellomlagretFrittståendeBrev,
    personopplysninger,
}) => {
    const brevmottakereMedBruker = (personopplysninger: IPersonopplysninger) => {
        return {
            personer: [
                {
                    mottakerRolle: EBrevmottakerRolle.BRUKER,
                    personIdent: personopplysninger.personIdent,
                    navn: personopplysninger.navn.visningsnavn,
                },
            ],
            organisasjoner: [],
        };
    };

    const brevmottakereValgt = (mottakere?: IBrevmottakere) => {
        return mottakere && (mottakere.personer.length > 0 || mottakere.organisasjoner.length > 0);
    };

    const [brevType, settBrevType] = useState<FrittståendeBrevtype | undefined>(
        mellomlagretFrittståendeBrev && mellomlagretFrittståendeBrev.brevType
    );
    const [overskrift, settOverskrift] = useState(
        (mellomlagretFrittståendeBrev && mellomlagretFrittståendeBrev.overskrift) || ''
    );
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>(
        initielleAvsnittMellomlager(mellomlagretFrittståendeBrev)
    );
    const [brevmottakere, settBrevmottakere] = useState<IBrevmottakere>(
        mellomlagretFrittståendeBrev?.mottakere &&
            brevmottakereValgt(mellomlagretFrittståendeBrev.mottakere)
            ? mellomlagretFrittståendeBrev.mottakere
            : brevmottakereMedBruker(personopplysninger)
    );

    const [feilmelding, settFeilmelding] = useState('');
    const [utsendingSuksess, setUtsendingSuksess] = useState(false);
    const [senderInnBrev, settSenderInnBrev] = useState(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest, settVisBrevmottakereModal } = useApp();
    const { toggles } = useToggles();

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FrittståendeBrevtype);
    };

    const endreOverskrift = (nyOverskrift: string) => {
        settOverskrift(nyOverskrift);
    };

    const endreAvsnitt = (nyttAvsnitt: AvsnittMedId[]) => {
        settAvsnitt(nyttAvsnitt);
    };

    const oppdaterFlyttAvsnittOppover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittOppover(avsnittId, avsnitt));
    };

    const oppdaterFlyttAvsnittNedover = (avsnittId: string) => {
        settAvsnitt(flyttAvsnittNedover(avsnittId, avsnitt));
    };

    const oppdaterLeggTilAvsnittFørst = () => {
        settAvsnitt(leggTilAvsnittFørst(avsnitt));
    };

    const oppdaterLeggAvsnittBakSisteSynligeAvsnitt = () => {
        settAvsnitt(leggAvsnittBakSisteSynligeAvsnitt(avsnitt));
    };

    const endreDeloverskriftAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, deloverskrift: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const endreInnholdAvsnitt = (radId: string) => {
        return (e: ChangeEvent<HTMLTextAreaElement>) => {
            const oppdaterteAvsnitt = avsnitt.map((rad) => {
                return rad.id === radId ? { ...rad, innhold: e.target.value } : rad;
            });
            settAvsnitt(oppdaterteAvsnitt);
        };
    };

    const fjernRad = (radId: string) => {
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) => {
            return eksisterendeAvsnitt.filter((rad) => radId !== rad.id);
        });
    };

    const mellomlagreFrittståendeBrev = (brev: IFrittståendeBrev): void => {
        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/mellomlager/frittstaende`,
            data: brev,
        });
    };

    const oppdaterBrevmottakere = (brevmottakere: IBrevmottakere) => {
        settBrevmottakere(brevmottakere);
        return Promise.resolve(byggSuksessRessurs('ok'));
    };

    const hentBrevmottakere = () => {
        return Promise.resolve(byggSuksessRessurs(brevmottakere));
    };

    const genererBrev = () => {
        if (!brevType) return;

        const brev: IFrittståendeBrev = {
            overskrift,
            avsnitt,
            fagsakId: fagsakId as string,
            brevType: brevType as FrittståendeBrevtype,
            mottakere: brevmottakere,
        };
        mellomlagreFrittståendeBrev(brev);
        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
        });
    };

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
        setUtsendingSuksess(false);
    };

    const nulstillBrev = () => {
        settAvsnitt([]);
        settOverskrift('');
        settBrevType(FrittståendeBrevtype.INFORMASJONSBREV);
        settBrevmottakere(brevmottakereMedBruker(personopplysninger));
    };

    const sendBrev = () => {
        if (senderInnBrev) return;
        if (!brevType) return;
        if (!fagsakId) return;
        if (!brevmottakereValgt(brevmottakere)) return;
        settSenderInnBrev(true);
        setUtsendingSuksess(false);
        settFeilmelding('');

        axiosRequest<string, IFrittståendeBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev/send`,
            data: {
                overskrift,
                avsnitt,
                fagsakId,
                brevType,
                mottakere: brevmottakere,
            },
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                setUtsendingSuksess(true);
                nulstillBrev();
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
            settSenderInnBrev(false);
        });
    };

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    useEffect(() => {
        genererBrev();
        //eslint-disable-next-line
    }, [brevmottakere]);

    const utledNavnPåMottakere = (brevMottakere: IBrevmottakere) => {
        return [
            ...brevMottakere.personer.map(
                (person) => `${person.navn} (${person.mottakerRolle.toLowerCase()})`
            ),
            ...brevMottakere.organisasjoner.map(
                (org) => `${org.organisasjonsnavn} (${org.mottakerRolle.toLowerCase()})`
            ),
        ];
    };

    const brevmottakerErValgt =
        brevmottakere.personer.length > 0 || brevmottakere.organisasjoner.length > 0;

    return (
        <StyledBrev>
            <h1>Brev</h1>
            {brevmottakerErValgt && (
                <Alert variant={'info'}>
                    <Heading size={'xsmall'}>Mottakere av brev:</Heading>
                    {utledNavnPåMottakere(brevmottakere).map((navn, index) => (
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    ))}
                </Alert>
            )}
            {toggles[ToggleName.visKnappVergeFrittståendeBrev] && (
                <Button variant={'tertiary'} onClick={() => settVisBrevmottakereModal(true)}>
                    Legg til verge eller fullmektig
                </Button>
            )}
            <BrevInnhold
                brevType={brevType}
                endreBrevType={endreBrevType}
                overskrift={overskrift}
                endreOverskrift={endreOverskrift}
                avsnitt={avsnitt}
                endreAvsnitt={endreAvsnitt}
                endreDeloverskriftAvsnitt={endreDeloverskriftAvsnitt}
                endreInnholdAvsnitt={endreInnholdAvsnitt}
                fjernRad={fjernRad}
                leggTilAvsnittFørst={oppdaterLeggTilAvsnittFørst}
                leggAvsnittBakSisteSynligeAvsnitt={oppdaterLeggAvsnittBakSisteSynligeAvsnitt}
                flyttAvsnittOpp={oppdaterFlyttAvsnittOppover}
                flyttAvsnittNed={oppdaterFlyttAvsnittNedover}
                context={FritekstBrevContext.FRITTSTÅENDE}
                stønadstype={Stønadstype.OVERGANGSSTØNAD}
            />
            <StyledHovedKnapp
                disabled={!brevType || !brevmottakereValgt(brevmottakere)}
                onClick={() => settVisModal(true)}
            >
                Send brev
            </StyledHovedKnapp>
            {visModal && (
                <UIModalWrapper
                    modal={{
                        tittel: 'Bekreft utsending av brev',
                        lukkKnapp: true,
                        visModal: true,
                        onClose: () => {
                            lukkModal();
                        },
                    }}
                >
                    {feilmelding && (
                        <AlertStripeFeil>Utsending feilet. {feilmelding}</AlertStripeFeil>
                    )}
                    {utsendingSuksess && (
                        <AlertStripeSuksess>Brevet er nå sendt.</AlertStripeSuksess>
                    )}
                    <ModalKnapper>
                        <Knapp onClick={lukkModal} disabled={utsendingSuksess}>
                            Avbryt
                        </Knapp>
                        <Hovedknapp onClick={sendBrev} disabled={senderInnBrev || utsendingSuksess}>
                            Send brev
                        </Hovedknapp>
                    </ModalKnapper>
                </UIModalWrapper>
            )}
            <BrevmottakereModal
                personopplysninger={personopplysninger}
                kallSettBrevmottakere={oppdaterBrevmottakere}
                kallHentBrevmottakere={hentBrevmottakere}
            />
        </StyledBrev>
    );
};

export default FrittståendeBrev;
