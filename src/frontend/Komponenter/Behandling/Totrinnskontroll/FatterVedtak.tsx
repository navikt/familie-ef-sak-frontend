import styled from 'styled-components';
import * as React from 'react';
import { FormEvent, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { BorderBox } from './Totrinnskontroll';
import { RessursStatus } from '@navikt/familie-typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EToast } from '../../../App/typer/toast';
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
} from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ÅrsakUnderkjent, årsakUnderkjentTilTekst } from '../../../App/typer/totrinnskontroll';
import { useNavigate } from 'react-router-dom';

const WrapperMedMargin = styled.div`
    display: block;
    margin: 1rem 0;
`;

const SubmitButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const TittelContainer = styled.div`
    margin: 0.5rem 0;
`;

const RadioMedPadding = styled(Radio)`
    padding-bottom: 4px;
`;

interface TotrinnskontrollForm {
    godkjent: boolean;
    begrunnelse?: string;
    årsakerUnderkjent: ÅrsakUnderkjent[];
}

enum Totrinnsresultat {
    IKKE_VALGT = 'IKKE_VALGT',
    GODKJENT = 'GODKJENT',
    UNDERKJENT = 'UNDERKJENT',
}

const FatterVedtak: React.FC<{
    behandlingId: string;
    settVisGodkjentModal: (vis: boolean) => void;
}> = ({ behandlingId, settVisGodkjentModal }) => {
    const [godkjent, settGodkjent] = useState<Totrinnsresultat>(Totrinnsresultat.IKKE_VALGT);
    const [årsakerUnderkjent, settÅrsakerUnderkjent] = useState<ÅrsakUnderkjent[]>([]);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();
    const { hentBehandlingshistorikk, hentTotrinnskontroll } = useBehandling();
    const navigate = useNavigate();

    const erUtfylt =
        godkjent === Totrinnsresultat.GODKJENT ||
        (godkjent === Totrinnsresultat.UNDERKJENT &&
            (begrunnelse || '').length > 0 &&
            årsakerUnderkjent.length > 0);

    const fatteTotrinnsKontroll = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        if (!erUtfylt) {
            return;
        }
        settFeil(undefined);
        axiosRequest<never, TotrinnskontrollForm>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/beslutte-vedtak`,
            data: {
                godkjent: godkjent === Totrinnsresultat.GODKJENT,
                begrunnelse,
                årsakerUnderkjent,
            },
        })
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (godkjent === Totrinnsresultat.GODKJENT) {
                        hentBehandlingshistorikk.rerun();
                        hentTotrinnskontroll.rerun();
                        settVisGodkjentModal(true);
                    } else {
                        settToast(EToast.VEDTAK_UNDERKJENT);
                        navigate('/oppgavebenk');
                    }
                } else {
                    settFeil(response.frontendFeilmeldingUtenFeilkode);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <form onSubmit={fatteTotrinnsKontroll}>
            <BorderBox>
                <TittelContainer>
                    <Heading size={'small'} level={'3'}>
                        Totrinnskontroll
                    </Heading>
                </TittelContainer>
                <BodyShortSmall>
                    Kontroller opplysninger og faglige vurderinger gjort under behandlingen
                </BodyShortSmall>
                <WrapperMedMargin>
                    <RadioGroup legend={'Beslutt vedtak'} value={godkjent} hideLegend>
                        <RadioMedPadding
                            value={Totrinnsresultat.GODKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settGodkjent(Totrinnsresultat.GODKJENT);
                                settBegrunnelse(undefined);
                                settÅrsakerUnderkjent([]);
                            }}
                        >
                            Godkjenn
                        </RadioMedPadding>
                        <RadioMedPadding
                            value={Totrinnsresultat.UNDERKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settGodkjent(Totrinnsresultat.UNDERKJENT);
                                settBegrunnelse(undefined);
                            }}
                        >
                            Underkjenn
                        </RadioMedPadding>
                    </RadioGroup>
                </WrapperMedMargin>
                {godkjent === Totrinnsresultat.UNDERKJENT && (
                    <>
                        <WrapperMedMargin>
                            <CheckboxGroup
                                legend={'Årsak til underkjennelse'}
                                description={'Manglende eller feil opplysninger om:'}
                                value={årsakerUnderkjent}
                                onChange={settÅrsakerUnderkjent}
                            >
                                {Object.values(ÅrsakUnderkjent).map((årsak) => (
                                    <Checkbox key={årsak} value={årsak}>
                                        {årsakUnderkjentTilTekst[årsak]}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </WrapperMedMargin>
                        <Textarea
                            value={begrunnelse || ''}
                            maxLength={0}
                            onChange={(e) => {
                                settBegrunnelse(e.target.value);
                            }}
                            label={'Begrunnelse'}
                        />
                    </>
                )}
                {erUtfylt && (
                    <SubmitButtonWrapper>
                        <Button type="submit" disabled={laster}>
                            Fullfør
                        </Button>
                    </SubmitButtonWrapper>
                )}
                {feil && <AlertStripeFeilPreWrap>{feil}</AlertStripeFeilPreWrap>}
            </BorderBox>
        </form>
    );
};

export default FatterVedtak;
