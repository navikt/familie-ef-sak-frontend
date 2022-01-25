import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Modal from 'nav-frontend-modal';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Radio } from 'nav-frontend-skjema';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { EToast } from '../../../App/typer/toast';

export enum EHenlagtårsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
    BEHANDLES_I_GOSYS = 'BEHANDLES_I_GOSYS',
}

interface IHenlegg {
    settHenlagtårsak: (årsak: EHenlagtårsak) => void;
    lagreHenleggelse: () => void;
    låsKnapp: boolean;
    henlagtårsak?: EHenlagtårsak;
    settVisHenleggModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HenleggModal: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { visHenleggModal, settVisHenleggModal } = useBehandling();

    const { axiosRequest, settToast } = useApp();
    const erBlankett = behandling.type === Behandlingstype.BLANKETT;
    const navigate = useNavigate();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lagreHenleggelse = () => {
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
        }

        if (låsKnapp || !henlagtårsak) {
            return;
        }
        settLåsKnapp(true);
        axiosRequest<string, { årsak: EHenlagtårsak }>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak,
            },
        })
            .then((respons: Ressurs<string>) => {
                switch (respons.status) {
                    case RessursStatus.SUKSESS:
                        navigate(`/fagsak/${behandling.fagsakId}`);
                        settToast(EToast.BEHANDLING_HENLAGT);
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    const ModalInnhold = styled.div`
        margin-top: 3rem;
    `;

    return (
        <Modal
            isOpen={visHenleggModal}
            onRequestClose={() => settVisHenleggModal(false)}
            closeButton={true}
            contentLabel={'Velg årsak til henleggelse'}
        >
            <ModalInnhold>
                {erBlankett ? (
                    <BlankettHenlegging
                        lagreHenleggelse={lagreHenleggelse}
                        settHenlagtårsak={settHenlagtårsak}
                        låsKnapp={låsKnapp}
                        settVisHenleggModal={settVisHenleggModal}
                    />
                ) : (
                    <Henlegging
                        lagreHenleggelse={lagreHenleggelse}
                        henlagtårsak={henlagtårsak}
                        settHenlagtårsak={settHenlagtårsak}
                        låsKnapp={låsKnapp}
                        settVisHenleggModal={settVisHenleggModal}
                    />
                )}
                {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
            </ModalInnhold>
        </Modal>
    );
};

const Henlegging: React.FC<IHenlegg> = ({
    settHenlagtårsak,
    lagreHenleggelse,
    låsKnapp,
    henlagtårsak,
    settVisHenleggModal,
}) => (
    <>
        <h4>Henlegg</h4>
        <FamilieRadioGruppe erLesevisning={false}>
            <Radio
                checked={henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE}
                label="Trukket tilbake"
                name="henleggRadio"
                onChange={() => {
                    settHenlagtårsak(EHenlagtårsak.TRUKKET_TILBAKE);
                }}
            />
            <Radio
                checked={henlagtårsak === EHenlagtårsak.FEILREGISTRERT}
                label="Feilregistrert"
                name="henleggRadio"
                onChange={() => {
                    settHenlagtårsak(EHenlagtårsak.FEILREGISTRERT);
                }}
            />
            <Hovedknapp htmlType={'submit'} onClick={lagreHenleggelse} disabled={låsKnapp}>
                Henlegg
            </Hovedknapp>
            <Knapp onClick={() => settVisHenleggModal(false)}>Avbryt</Knapp>
        </FamilieRadioGruppe>
    </>
);

const BlankettHenlegging: React.FC<IHenlegg> = ({
    settHenlagtårsak,
    lagreHenleggelse,
    låsKnapp,
    settVisHenleggModal,
}) => (
    <>
        <Hovedknapp
            htmlType={'submit'}
            onClick={() => {
                settHenlagtårsak(EHenlagtårsak.BEHANDLES_I_GOSYS);
                lagreHenleggelse();
            }}
            disabled={låsKnapp}
        >
            Henlegg
        </Hovedknapp>
        <Knapp onClick={() => settVisHenleggModal(false)}>Avbryt</Knapp>
    </>
);
