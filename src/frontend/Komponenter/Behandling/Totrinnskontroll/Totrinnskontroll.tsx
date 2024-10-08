import * as React from 'react';
import { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import {
    TotrinnskontrollOpprettet,
    TotrinnskontrollStatus,
    TotrinnskontrollUnderkjentResponse,
    årsakUnderkjentTilTekst,
} from '../../../App/typer/totrinnskontroll';
import FatterVedtak from './FatterVedtak';
import styled from 'styled-components';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import Info from '../../../Felles/Ikoner/Info';
import { BreakWordBodyLongSmall } from '../../../Felles/Visningskomponenter/BreakWordBodyLongSmall';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button, Detail, Heading, Label } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { XMarkIcon } from '@navikt/aksel-icons';
import { useNavigate } from 'react-router-dom';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';

const BorderBox = styled.div`
    border: 1px solid ${ABorderSubtle};
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;

    .ikon-med-tekst {
        display: flex;
        > svg {
            padding-right: 0.25rem;
        }
    }
    > div {
        padding-top: 0.5rem;
    }
`;

const ÅrsakUnderkjentContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.65rem;
`;

const IconContainer = styled.div`
    width: 18px;
    height: 18px;
`;

const AngreSendTilBeslutterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const Totrinnskontroll: FC = () => {
    const navigate = useNavigate();
    const [visGodkjentModal, settVisGodkjentModal] = useState(false);

    return (
        <>
            <TotrinnskontrollSwitch settVisGodkjentModal={settVisGodkjentModal} />
            <ModalWrapper
                tittel={'Vedtaket er godkjent'}
                visModal={visGodkjentModal}
                onClose={() => settVisGodkjentModal(false)}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => navigate('/oppgavebenk'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => settVisGodkjentModal(false), tekst: 'Lukk' },
                    marginTop: 4,
                }}
            />
        </>
    );
};

const TotrinnskontrollSwitch: FC<{ settVisGodkjentModal: (vis: boolean) => void }> = ({
    settVisGodkjentModal,
}) => {
    const { behandling, totrinnskontroll } = useBehandling();

    if (
        behandling.status !== RessursStatus.SUKSESS ||
        totrinnskontroll.status !== RessursStatus.SUKSESS
    ) {
        return null;
    }

    switch (totrinnskontroll.data.status) {
        case TotrinnskontrollStatus.KAN_FATTE_VEDTAK:
            return (
                <FatterVedtak
                    behandling={behandling.data}
                    settVisGodkjentModal={settVisGodkjentModal}
                />
            );
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return (
                <SendtTilBeslutter
                    totrinnskontroll={totrinnskontroll.data.totrinnskontroll}
                    behandlingId={behandling.data.id}
                />
            );
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <TotrinnskontrollUnderkjent
                    totrinnskontroll={totrinnskontroll.data.totrinnskontroll}
                />
            );
        case TotrinnskontrollStatus.UAKTUELT:
            return null;
    }
};

const SendtTilBeslutter: React.FC<{
    totrinnskontroll: TotrinnskontrollOpprettet;
    behandlingId: string;
}> = ({ totrinnskontroll, behandlingId }) => {
    const { axiosRequest } = useApp();
    const {
        hentBehandling,
        hentVedtak,
        hentTotrinnskontroll,
        hentBehandlingshistorikk,
        hentAnsvarligSaksbehandler,
    } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);

    const angreSendTilBeslutter = () => {
        if (laster) {
            return;
        }
        settLaster(true);
        settFeilmelding('');
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/angre-send-til-beslutter`,
        })
            .then((res: RessursSuksess<string> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    hentVedtak.rerun();
                    hentTotrinnskontroll.rerun();
                    hentBehandlingshistorikk.rerun();
                    hentAnsvarligSaksbehandler.rerun();
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    return (
        <BorderBox>
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <div className="ikon-med-tekst">
                <Info height={20} width={20} />
                <SmallTextLabel>Vedtaket er sendt til godkjenning</SmallTextLabel>
            </div>
            <div>
                <BodyShortSmall>{totrinnskontroll.opprettetAv}</BodyShortSmall>
                <BodyShortSmall>{formaterIsoDatoTid(totrinnskontroll.opprettetTid)}</BodyShortSmall>
            </div>
            <AngreSendTilBeslutterContainer>
                <Button
                    size="small"
                    disabled={laster}
                    variant={'secondary'}
                    onClick={angreSendTilBeslutter}
                >
                    Angre sendt til beslutter
                </Button>
                {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            </AngreSendTilBeslutterContainer>
        </BorderBox>
    );
};

const TotrinnskontrollUnderkjent: React.FC<{
    totrinnskontroll: TotrinnskontrollUnderkjentResponse;
}> = ({ totrinnskontroll }) => {
    return (
        <BorderBox>
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <div className="ikon-med-tekst">
                <Advarsel heigth={20} width={20} />
                <SmallTextLabel>Vedtaket er underkjent</SmallTextLabel>
            </div>
            <div>
                <BodyShortSmall>{totrinnskontroll.opprettetAv}</BodyShortSmall>
                <BodyShortSmall>{formaterIsoDatoTid(totrinnskontroll.opprettetTid)}</BodyShortSmall>
            </div>
            {totrinnskontroll.årsakerUnderkjent.length > 0 && (
                <div>
                    <Label>Årsak til underkjennelse</Label>
                    <Detail>Manglende eller feil opplysninger om:</Detail>
                    <>
                        {totrinnskontroll.årsakerUnderkjent.map((årsakUnderkjent) => (
                            <ÅrsakUnderkjentContainer key={årsakUnderkjent}>
                                <IconContainer>
                                    <XMarkIcon />
                                </IconContainer>
                                <BodyShortSmall>
                                    {årsakUnderkjentTilTekst[årsakUnderkjent]}
                                </BodyShortSmall>
                            </ÅrsakUnderkjentContainer>
                        ))}
                    </>
                </div>
            )}
            <div>
                <Label>Begrunnelse</Label>
                <BreakWordBodyLongSmall>{totrinnskontroll.begrunnelse}</BreakWordBodyLongSmall>
            </div>
        </BorderBox>
    );
};

export default Totrinnskontroll;
