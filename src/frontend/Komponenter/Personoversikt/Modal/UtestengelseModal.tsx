import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { BodyLong, BodyShort, Label } from '@navikt/ds-react';
import MånedÅrVelger from '../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { månederMellom, månedÅrTilDate } from '../../../App/utils/dato';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

const ModalInnhold = styled.div`
    margin-top: 3rem;
`;

const HuskListe = styled.ol`
    margin-top: 0.25rem;
    padding-left: 1.75rem;
`;

const Periode = styled.div`
    display: flex;
    justify-content: space-between;
`;

const AntallMånederWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const AntallMåneder = styled(BodyShort)`
    margin-top: 1.25rem;
    text-align: center;
`;

interface IOpprettUtestengelse {
    fagsakPersonId: string;
    periode: { fom: string; tom: string };
}

/**
 * TODO: Endre til ny modal
 */
export const UtestengelseModal: FC<{
    fagsakPersonId: string;
    hentUtestengelser: (fagsakPersonId: string) => void;
}> = ({ fagsakPersonId, hentUtestengelser }) => {
    const { axiosRequest, visUtestengModal, settVisUtestengModal } = useApp();
    const [feilmelding, settFeilmelding] = useState<string>();

    const [fraOgMed, settFraOgMed] = useState<string>();
    const [tilOgMed, settTilOgMed] = useState<string>();
    const [senderInnUtestenging, settSenderInnUtestenging] = useState<boolean>(false);

    const lagUtestenging = () => {
        settFeilmelding('');
        if (!fraOgMed || !tilOgMed) {
            settFeilmelding('Mangler fra eller til-dato');
            return;
        }
        if (!senderInnUtestenging) {
            settSenderInnUtestenging(true);
            axiosRequest<Ressurs<void>, IOpprettUtestengelse>({
                method: 'POST',
                url: `/familie-ef-sak/api/utestengelse/${fagsakPersonId}`,
                data: {
                    fagsakPersonId: fagsakPersonId,
                    periode: {
                        fom: fraOgMed,
                        tom: tilOgMed,
                    },
                },
            }).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    hentUtestengelser(fagsakPersonId);
                    lukkModal();
                } else {
                    settFeilmelding(response.frontendFeilmelding || response.melding);
                }
                settSenderInnUtestenging(false);
            });
        }
    };

    const lukkModal = () => {
        settFeilmelding('');
        settVisUtestengModal(false);
        settFraOgMed(undefined);
        settTilOgMed(undefined);
        settSenderInnUtestenging(false);
    };

    const antallMåneder =
        fraOgMed && tilOgMed && månederMellom(månedÅrTilDate(fraOgMed), månedÅrTilDate(tilOgMed));

    return (
        <ModalWrapper
            tittel="Utestengelse"
            visModal={visUtestengModal}
            onClose={() => lukkModal()}
            hovedKnappClick={() => lagUtestenging()}
            hovedKnappTekst={'Bekreft utestengelse'}
            hovedKnappDisabled={senderInnUtestenging}
            lukkKnappTekst={'Avbryt'}
            lukkKnappDisabled={senderInnUtestenging}
        >
            <ModalInnhold>
                <BodyLong spacing={true}>
                    Husk at perioden for utestenging trer i kraft fra og med måneden etter den
                    måneden vedtak om utestenging er fattet.
                </BodyLong>
                <BodyShort>Husk også at det må:</BodyShort>
                <HuskListe>
                    <li>Oppretts notat om utestengelse i Gosys</li>
                    <li>Hvis bruker har løpende stønader manuelt opphøre disse</li>
                    <li>
                        Sendes brev om utestengelse til bruker fra EF Sak frittstående brevutsender
                    </li>
                </HuskListe>
                <Periode>
                    <MånedÅrVelger
                        antallÅrFrem={2}
                        antallÅrTilbake={1}
                        feilmelding={''}
                        label={'Periode fra og med'}
                        aria-label={'Periode fra og med'}
                        onEndret={(e) => settFraOgMed(e)}
                    ></MånedÅrVelger>
                    <MånedÅrVelger
                        antallÅrFrem={2}
                        antallÅrTilbake={1}
                        feilmelding={''}
                        label={'Periode til og med'}
                        aria-label={'Periode til og med'}
                        onEndret={(e) => settTilOgMed(e)}
                    ></MånedÅrVelger>
                    <AntallMånederWrapper>
                        <Label size={'small'}>Ant.mnd</Label>
                        <AntallMåneder size={'small'}>{antallMåneder}</AntallMåneder>
                    </AntallMånederWrapper>
                </Periode>
                {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
            </ModalInnhold>
        </ModalWrapper>
    );
};
