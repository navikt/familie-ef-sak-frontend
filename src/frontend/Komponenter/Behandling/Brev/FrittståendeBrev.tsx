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
import { Hovedknapp } from 'nav-frontend-knapper';
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
import { Alert, BodyShort, Button, Heading, Label, Tooltip } from '@navikt/ds-react';
import { BrevmottakereModal } from '../Brevmottakere/BrevmottakereModal';
import { EBrevmottakerRolle, IBrevmottakere } from '../Brevmottakere/typer';
import { EToast } from '../../../App/typer/toast';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

const StyledBrev = styled.div`
    margin-bottom: 10rem;
    width: 48rem;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-top: 1rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 9rem 23rem 16rem;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 29rem 14rem;
`;

const SideTittel = styled(Heading)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const KompaktButton = styled(Button)`
    padding: 0;
    justify-content: right;

    .navds-button__inner {
        margin: 0;
    }
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
    const [senderInnBrev, settSenderInnBrev] = useState(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();

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
    };

    const nullstillBrev = () => {
        settAvsnitt([]);
        settOverskrift('');
        settBrevType(undefined);
        settBrevmottakere(brevmottakereMedBruker(personopplysninger));
    };

    const sendBrev = () => {
        if (senderInnBrev) return;
        if (!brevType) return;
        if (!fagsakId) return;
        if (!brevmottakereValgt(brevmottakere)) return;
        settSenderInnBrev(true);
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
                nullstillBrev();
                settToast(EToast.BREV_SENDT);
                lukkModal();
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

    return (
        <StyledBrev>
            <SideTittel level={'1'} size={'large'}>
                Brev
            </SideTittel>
            <BrevMottakere mottakere={brevmottakere} />
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
            <ModalWrapper
                tittel={'Bekreft utsending av brev'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => sendBrev(),
                        tekst: 'Send brev',
                        disabled: senderInnBrev,
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && (
                    <AlertStripe variant={'error'}>Utsending feilet. {feilmelding}</AlertStripe>
                )}
            </ModalWrapper>
            <BrevmottakereModal
                personopplysninger={personopplysninger}
                kallSettBrevmottakere={oppdaterBrevmottakere}
                kallHentBrevmottakere={hentBrevmottakere}
            />
        </StyledBrev>
    );
};

const BrevMottakere: React.FC<{ mottakere: IBrevmottakere }> = ({ mottakere }) => {
    const { settVisBrevmottakereModal } = useApp();
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

    const navn = utledNavnPåMottakere(mottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const brukerErBrevmottaker = mottakere.personer.find(
        (person) => person.mottakerRolle === EBrevmottakerRolle.BRUKER
    );

    return flereBrevmottakereErValgt || !brukerErBrevmottaker ? (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <KompaktButton
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </KompaktButton>
                </Tooltip>
            </InfoHeader>
            <ul>
                {navn.map((navn, index) => (
                    <li>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <Grid>
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                <KompaktButton variant={'tertiary'} onClick={() => settVisBrevmottakereModal(true)}>
                    Legg til/endre brevmottakere
                </KompaktButton>
            </Tooltip>
        </Grid>
    );
};

export default FrittståendeBrev;
