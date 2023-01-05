import * as React from 'react';
import { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../App/typer/ressurs';
import {
    TotrinnskontrollOpprettet,
    TotrinnskontrollStatus,
    TotrinnskontrollUnderkjentResponse,
    årsakUnderkjentTilTekst,
} from '../../../App/typer/totrinnskontroll';
import FatterVedtak, { Totrinnsresultat } from './FatterVedtak';
import styled from 'styled-components';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import Info from '../../../Felles/Ikoner/Info';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { useApp } from '../../../App/context/AppContext';
import { BodyShort, Detail, Heading, Label } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { SuccessStroke } from '@navikt/ds-icons';

export const BorderBox = styled.div`
    border: 1px solid #c6c2bf;
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

const SukksessIkonMedHøyreMargin = styled(SuccessStroke)`
    margin-right: 0.5rem;
`;

const ÅrsakUnderkjentRad = styled(BodyShort)`
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
`;

const ÅrsakerUnderkjentWrapper = styled.div`
    margin-top: 0.5rem;
`;

const Totrinnskontroll: FC = () => {
    const { gåTilUrl } = useApp();
    const [visModalTotrinnsresultat, settVisModalTotrinnsresultat] = useState<Totrinnsresultat>(
        Totrinnsresultat.IKKE_VALGT
    );

    const lukkModal = () => settVisModalTotrinnsresultat(Totrinnsresultat.IKKE_VALGT);

    return (
        <>
            <TotrinnskontrollSwitch
                totrinnsresultat={visModalTotrinnsresultat}
                settVisModalTotrinnsresultat={settVisModalTotrinnsresultat}
            />
            <ModalWrapper
                tittel={
                    visModalTotrinnsresultat === Totrinnsresultat.GODKJENT
                        ? 'Vedtaket er godkjent'
                        : 'Vedtaket er underkjent'
                }
                visModal={visModalTotrinnsresultat !== Totrinnsresultat.IKKE_VALGT}
                onClose={() => lukkModal()}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: () => gåTilUrl('/oppgavebenk'),
                        tekst: 'Til oppgavebenk',
                    },
                    lukkKnapp: { onClick: () => lukkModal(), tekst: 'Lukk' },
                    marginTop: 4,
                }}
            />
        </>
    );
};

const TotrinnskontrollSwitch: FC<{
    totrinnsresultat: Totrinnsresultat;
    settVisModalTotrinnsresultat: (result: Totrinnsresultat) => void;
}> = ({ settVisModalTotrinnsresultat }) => {
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
                    behandlingId={behandling.data.id}
                    settVisModalTotrinnsresultat={settVisModalTotrinnsresultat}
                />
            );
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return <SendtTilBeslutter totrinnskontroll={totrinnskontroll.data.totrinnskontroll} />;
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

const SendtTilBeslutter: React.FC<{ totrinnskontroll: TotrinnskontrollOpprettet }> = ({
    totrinnskontroll,
}) => {
    return (
        <BorderBox>
            <Heading size={'small'} level={'3'}>
                Totrinnskontroll
            </Heading>
            <div className="ikon-med-tekst">
                <Info heigth={20} width={20} />
                <SmallTextLabel>Vedtaket er sendt til godkjenning</SmallTextLabel>
            </div>
            <div>
                <BodyShortSmall>{totrinnskontroll.opprettetAv}</BodyShortSmall>
                <BodyShortSmall>{formaterIsoDatoTid(totrinnskontroll.opprettetTid)}</BodyShortSmall>
            </div>
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
                    <ÅrsakerUnderkjentWrapper>
                        {totrinnskontroll.årsakerUnderkjent.map((årsakUnderkjent) => (
                            <ÅrsakUnderkjentRad>
                                <SukksessIkonMedHøyreMargin />
                                {årsakUnderkjentTilTekst[årsakUnderkjent]}
                            </ÅrsakUnderkjentRad>
                        ))}
                    </ÅrsakerUnderkjentWrapper>
                </div>
            )}
            <div>
                <Label>Begrunnelse</Label>
                <BreakWordNormaltekst>{totrinnskontroll.begrunnelse}</BreakWordNormaltekst>
            </div>
        </BorderBox>
    );
};

export default Totrinnskontroll;
