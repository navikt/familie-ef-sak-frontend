import React, { useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { BrevmalSelect } from './BrevmalSelect';
import { useHentBrevmaler } from '../../../App/hooks/useHentBrevmaler';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentBrevStruktur } from '../../../App/hooks/useHentBrevStruktur';
import BrevmenyVisning from './BrevmenyVisning';
import { useMellomlagringFrittståendeSanitybrev } from '../../../App/hooks/useMellomlagringFrittståendeSanitybrev';
import { IMellomlagretBrevResponse } from '../../../App/hooks/useMellomlagringBrev';
import { lagTomBrevverdier } from '../../../App/hooks/useVerdierForBrev';
import { brevmottakereValgt, mottakereEllerBruker } from '../Brevmottakere/brevmottakerUtils';
import { Brevtype, FrittståendeSanitybrevDto } from './BrevTyper';
import { EToast } from '../../../App/typer/toast';
import { IBrevmottakere } from '../Brevmottakere/typer';
import { useApp } from '../../../App/context/AppContext';
import Brevmottakere from '../Brevmottakere/Brevmottakere';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Knapp } from '../../../Felles/Knapper/HovedKnapp';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { utledDokumenttittel } from './BrevUtils';

type FrittståendeSanitybrevProps = {
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    brevRessurs: Ressurs<string>;
};

const StyledFrittståendeBrev = styled.div`
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const FrittståendeSanitybrev: React.FC<FrittståendeSanitybrevProps> = ({
    fagsakId,
    oppdaterBrevRessurs,
    personopplysninger,
    brevRessurs,
}) => {
    const [brevMal, settBrevmal] = useState<string>();
    const { brevmaler } = useHentBrevmaler();
    const { brevStruktur } = useHentBrevStruktur(brevMal);
    const [brevverdier] = useState(lagTomBrevverdier);
    const { mellomlagreSanitybrev, mellomlagretBrev, settMellomlagretBrev } =
        useMellomlagringFrittståendeSanitybrev(fagsakId);
    const [laster, settLaster] = useState(false);
    const [brevmottakere, settBrevmottakere] = useState<IBrevmottakere>(
        mottakereEllerBruker(personopplysninger, undefined) // TODO: Legg til støtte for lagring av brevmottakere
    );
    const [feilmelding, settFeilmelding] = useState('');
    const [visModal, settVisModal] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();

    const lukkModal = () => {
        settVisModal(false);
        settFeilmelding('');
    };

    const oppdaterBrevmottakere = (brevmottakere: IBrevmottakere) => {
        settBrevmottakere(brevmottakere);
        return Promise.resolve(byggSuksessRessurs('ok'));
    };

    useEffect(() => {
        if (
            mellomlagretBrev.status === RessursStatus.SUKSESS &&
            mellomlagretBrev.data?.brevtype === Brevtype.SANITYBREV
        ) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev]);

    const sendBrev = () => {
        if (laster) return;
        if (!fagsakId) return;
        if (!brevmottakereValgt(brevmottakere)) return;
        if (brevRessurs.status !== RessursStatus.SUKSESS) return;
        settLaster(true);
        settFeilmelding('');

        const dokumenttittel = utledDokumenttittel(brevmaler, brevMal);
        if (!dokumenttittel) return;

        axiosRequest<null, FrittståendeSanitybrevDto>({
            method: 'POST',
            url: `/familie-ef-sak/api/frittstaende-brev/send/${fagsakId}`,
            data: {
                pdf: brevRessurs.data,
                tittel: dokumenttittel,
                mottakere: brevmottakere,
            },
        }).then((respons: RessursSuksess<null> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                nullstillBrev();
                settToast(EToast.BREV_SENDT);
                lukkModal();
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
            settLaster(false);
        });
    };

    const nullstillBrev = () => {
        settBrevmal('');
        oppdaterBrevRessurs(byggTomRessurs());
        settMellomlagretBrev(byggTomRessurs());
    };

    return (
        <StyledFrittståendeBrev>
            <Brevmottakere
                personopplysninger={personopplysninger}
                mottakere={brevmottakere}
                kallSettBrevmottakere={oppdaterBrevmottakere}
            />
            <div>
                <BrevmalSelect
                    dokumentnavn={brevmaler}
                    settBrevmal={settBrevmal}
                    brevmal={brevMal}
                    frittstående={true}
                />
                {brevMal && (
                    <DataViewer response={{ brevStruktur, mellomlagretBrev }}>
                        {({ brevStruktur, mellomlagretBrev }) => (
                            <BrevmenyVisning
                                fagsakId={fagsakId}
                                brevMal={brevMal}
                                oppdaterBrevRessurs={oppdaterBrevRessurs}
                                brevStruktur={brevStruktur}
                                mellomlagreSanityBrev={mellomlagreSanitybrev}
                                mellomlagretBrevVerdier={
                                    (mellomlagretBrev as IMellomlagretBrevResponse)?.brevverdier
                                }
                                personopplysninger={personopplysninger}
                                settBrevOppdatert={(laster) => settLaster(!laster)}
                                brevverdier={brevverdier}
                            />
                        )}
                    </DataViewer>
                )}
                <Knapp
                    disabled={
                        brevRessurs.status !== RessursStatus.SUKSESS ||
                        !brevmottakereValgt(brevmottakere)
                    }
                    onClick={() => settVisModal(true)}
                    type={'button'}
                >
                    Send brev
                </Knapp>
            </div>
            <ModalWrapper
                tittel={'Bekreft utsending av brev'}
                visModal={visModal}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => sendBrev(),
                        tekst: 'Send brev',
                        disabled: laster,
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                    marginTop: 4,
                }}
                ariaLabel={'Bekreft ustending av frittstående brev'}
            >
                {feilmelding && <Alert variant={'error'}>Utsending feilet. {feilmelding}</Alert>}
            </ModalWrapper>
        </StyledFrittståendeBrev>
    );
};
