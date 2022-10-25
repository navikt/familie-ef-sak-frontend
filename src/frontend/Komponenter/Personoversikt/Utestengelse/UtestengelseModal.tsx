import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';
import { BodyShort, Label } from '@navikt/ds-react';
import MånedÅrVelger from '../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { månederMellom, månedÅrTilDate } from '../../../App/utils/dato';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { EToast } from '../../../App/typer/toast';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

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

export const UtestengelseModal: FC<{
    fagsakPersonId: string;
    hentUtestengelser: (fagsakPersonId: string) => void;
}> = ({ fagsakPersonId, hentUtestengelser }) => {
    const { axiosRequest, visUtestengModal, settVisUtestengModal, settToast } = useApp();
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
                    settToast(EToast.OPPRETTET_UTESTENGELSE);
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
            tittel="Legg til utestengelse"
            visModal={visUtestengModal}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                lukkKnapp: {
                    tekst: 'Avbryt',
                    disabled: senderInnUtestenging,
                    onClick: () => lukkModal(),
                },
                hovedKnapp: {
                    tekst: 'Bekreft utestengelse',
                    disabled: senderInnUtestenging,
                    onClick: () => lagUtestenging(),
                },
                marginTop: 2,
            }}
        >
            <Periode>
                <MånedÅrVelger
                    antallÅrFrem={2}
                    antallÅrTilbake={1}
                    feilmelding={''}
                    label={'Periode fra og med'}
                    aria-label={'Periode fra og med'}
                    onEndret={(e) => settFraOgMed(e)}
                />
                <MånedÅrVelger
                    antallÅrFrem={2}
                    antallÅrTilbake={1}
                    feilmelding={''}
                    label={'Periode til og med'}
                    aria-label={'Periode til og med'}
                    onEndret={(e) => settTilOgMed(e)}
                />
                <AntallMånederWrapper>
                    <Label size={'small'}>Ant.mnd</Label>
                    <AntallMåneder size={'small'}>{antallMåneder}</AntallMåneder>
                </AntallMånederWrapper>
            </Periode>
            {feilmelding && <AlertError>{feilmelding}</AlertError>}
        </ModalWrapper>
    );
};
