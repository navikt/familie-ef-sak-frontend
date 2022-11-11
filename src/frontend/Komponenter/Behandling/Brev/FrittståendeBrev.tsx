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
import { Alert, Heading } from '@navikt/ds-react';
import { BrevmottakereModal } from '../Brevmottakere/BrevmottakereModal';
import { IBrevmottakere } from '../Brevmottakere/typer';
import { EToast } from '../../../App/typer/toast';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import BrevMottakere from './BrevMottakere';
import {
    brevmottakereMedBruker,
    brevmottakereValgt,
    mottakereEllerBruker,
} from '../Brevmottakere/brevmottakerUtils';

const StyledBrev = styled.div`
    margin-bottom: 5rem;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-top: 1rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 2rem;
`;

const SideTittel = styled(Heading)`
    margin-top: 1rem;
    margin-bottom: 1rem;
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
        mottakereEllerBruker(personopplysninger, mellomlagretFrittståendeBrev?.mottakere)
    );

    const [feilmelding, settFeilmelding] = useState('');
    const [senderInnBrev, settSenderInnBrev] = useState(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();
    const [visNullstillBrevModal, settVisNullstillBrevModal] = useState<boolean>(false);

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

    const nullstillMellomlagretBrev = (): void => {
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `/familie-ef-sak/api/brev/mellomlager/frittstaende/${fagsakId}`,
        }).finally(() => {
            nullstillBrev();
            settVisNullstillBrevModal(false);
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
                settVisNullstillBrevModal={settVisNullstillBrevModal}
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
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && (
                    <AlertStripe variant={'error'}>Utsending feilet. {feilmelding}</AlertStripe>
                )}
            </ModalWrapper>
            <ModalWrapper
                tittel={'Bekreft nullstilling av brev'}
                visModal={visNullstillBrevModal}
                onClose={() => settVisNullstillBrevModal(false)}
                aksjonsknapper={{
                    hovedKnapp: { onClick: () => nullstillMellomlagretBrev(), tekst: 'Nullstill' },
                    lukkKnapp: { onClick: () => settVisNullstillBrevModal(false), tekst: 'Avbryt' },
                }}
            >
                Er du sikker på at du vil nullstille brevet? Du vil miste alle lagrede opplysninger
            </ModalWrapper>
            <BrevmottakereModal
                personopplysninger={personopplysninger}
                kallSettBrevmottakere={oppdaterBrevmottakere}
                kallHentBrevmottakere={hentBrevmottakere}
            />
        </StyledBrev>
    );
};

export default FrittståendeBrev;
