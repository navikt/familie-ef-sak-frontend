import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    dagsgrenseForAdvarsel,
    sanksjonAdvarsel,
    sanksjonInfoDel1,
    sanksjonInfoDel2,
    Sanksjonsårsak,
    sanksjonsårsaker,
    sanksjonsårsakTilTekst,
    stønaderForSanksjonInfo,
} from '../../../App/typer/Sanksjonsårsak';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import {
    EAktivitet,
    EBehandlingResultat,
    EPeriodetype,
    ISanksjonereVedtak,
    ISanksjonereVedtakDto,
    IVedtak,
} from '../../../App/typer/vedtak';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import useFormState, { FormState } from '../../../App/hooks/felles/useFormState';
import { validerSanksjonereVedtakForm } from '../VedtakOgBeregning/vedtaksvalidering';
import { FieldState } from '../../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import { FamilieSelect } from '@navikt/familie-form-elements';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import {
    nåværendeÅrOgMånedFormatert,
    nesteMånedOgNesteMånedsÅrFormatert,
    SANKSJONERE_VEDTAK,
    antallDagerIgjenAvNåværendeMåned,
} from './utils';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

export type SanksjonereVedtakForm = ISanksjonereVedtakDto;

const SanksjonVelger = styled(FamilieSelect)`
    margin-top: 1rem;
`;

const Container = styled.div`
    margin: 2rem;
`;

const Seksjon = styled.div`
    margin-top: 2rem;
`;

const NormaltekstMedMargin = styled(Normaltekst)`
    margin-top: 1rem;
`;

const InfoVisning = styled(AlertStripeInfo)`
    max-width: 60rem;
    .alertstripe__tekst {
        max-width: 60rem;
    }
`;

const AdvarselVisning = styled(AlertStripeAdvarsel)`
    margin-top: 1.5rem;
    max-width: 60rem;
    .alertstripe__tekst {
        max-width: 60rem;
    }
`;

interface Props {
    behandlingId: string;
}

const Sanksjonsfastsettelse: FC<Props> = ({ behandlingId }) => {
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);
    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);
    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => {
                return <SanksjonsvedtakVisning behandlingId={behandlingId} lagretVedtak={vedtak} />;
            }}
        </DataViewer>
    );
};

const SanksjonsvedtakVisning: FC<{ behandlingId: string; lagretVedtak?: IVedtak }> = ({
    behandlingId,
    lagretVedtak,
}) => {
    const lagretSanksjonertVedtak =
        lagretVedtak?.resultatType === EBehandlingResultat.SANKSJONERE
            ? (lagretVedtak as ISanksjonereVedtak)
            : undefined;
    const [feilmelding, settFeilmelding] = useState<string>();
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const navigate = useNavigate();
    const [laster, settLaster] = useState<boolean>(false);

    const formState = useFormState<SanksjonereVedtakForm>(
        {
            sanksjonsårsak: lagretSanksjonertVedtak?.sanksjonsårsak || '',
            internBegrunnelse: lagretSanksjonertVedtak?.internBegrunnelse || '',
        },
        validerSanksjonereVedtakForm
    );

    const sanksjonårsak = formState.getProps('sanksjonsårsak') as FieldState;
    const internBegrunnelse = formState.getProps('internBegrunnelse') as FieldState;

    const håndterVedtaksresultat = (nesteUrl: string) => {
        return (res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    navigate(nesteUrl);
                    hentBehandling.rerun();
                    nullstillIkkePersisterteKomponenter();
                    break;
                case RessursStatus.HENTER:
                case RessursStatus.IKKE_HENTET:
                    break;
                default:
                    settFeilmelding(res.frontendFeilmelding);
            }
        };
    };

    const lagreVedtak = (vedtaksRequest: ISanksjonereVedtak) => {
        settLaster(true);

        axiosRequest<string, ISanksjonereVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/fullfor`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat(`/behandling/${behandlingId}/simulering`))
            .finally(() => {
                settLaster(false);
            });
    };

    const handleSubmit = (form: FormState<SanksjonereVedtakForm>) => {
        const årOgMåned = nesteMånedOgNesteMånedsÅrFormatert();
        const vedtaksRequest: ISanksjonereVedtak = {
            resultatType: EBehandlingResultat.SANKSJONERE,
            sanksjonsårsak: form.sanksjonsårsak,
            internBegrunnelse: form.internBegrunnelse,
            periode: {
                periodeType: EPeriodetype.SANKSJON,
                aktivitet: EAktivitet.IKKE_AKTIVITETSPLIKT,
                årMånedFra: årOgMåned,
                årMånedTil: årOgMåned,
            },
        };
        lagreVedtak(vedtaksRequest);
    };

    const dagerIgjenAvMåned = antallDagerIgjenAvNåværendeMåned();

    return (
        <Container>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <section>
                    <Undertittel>Sanksjon</Undertittel>
                    <SanksjonVelger
                        label="Brukeren har uten rimelig grunn:"
                        value={sanksjonårsak.value}
                        bredde={'xxl'}
                        onChange={(e) => {
                            settIkkePersistertKomponent(SANKSJONERE_VEDTAK);
                            sanksjonårsak.onChange(e);
                        }}
                        erLesevisning={!behandlingErRedigerbar}
                    >
                        <option value="">Velg</option>
                        {sanksjonsårsaker.map((sanksjonsårsak: Sanksjonsårsak, index: number) => (
                            <option key={index} value={sanksjonsårsak}>
                                {sanksjonsårsakTilTekst[sanksjonsårsak]}
                            </option>
                        ))}
                    </SanksjonVelger>
                    <SkjemaelementFeilmelding>
                        {formState.errors.sanksjonsårsak}
                    </SkjemaelementFeilmelding>
                </section>
                {sanksjonårsak.value && (
                    <>
                        <Seksjon>
                            <Undertittel>Sanksjonsperiode</Undertittel>
                            <NormaltekstMedMargin>
                                Måneden for sanksjon er <b>{nåværendeÅrOgMånedFormatert()}</b> som
                                er måneden etter dette vedtaket. Bruker vil ikke få utbetalt stønad
                                i denne perioden.
                            </NormaltekstMedMargin>
                        </Seksjon>
                        <Seksjon>
                            <InfoVisning>
                                {sanksjonInfoDel1}
                                <br />
                                <ul>
                                    {stønaderForSanksjonInfo.map((stønad) => (
                                        <li>{stønad}</li>
                                    ))}
                                </ul>
                                {sanksjonInfoDel2}
                            </InfoVisning>
                            {dagerIgjenAvMåned < dagsgrenseForAdvarsel && (
                                <AdvarselVisning>
                                    {sanksjonAdvarsel(dagerIgjenAvMåned)}
                                </AdvarselVisning>
                            )}
                        </Seksjon>
                        <Seksjon>
                            <EnsligTextArea
                                label={'Begrunnelse (intern)'}
                                value={internBegrunnelse.value}
                                onChange={(event) => {
                                    settIkkePersistertKomponent(SANKSJONERE_VEDTAK);
                                    internBegrunnelse.onChange(event);
                                }}
                                erLesevisning={!behandlingErRedigerbar}
                                feilmelding={formState.errors.internBegrunnelse}
                            />
                        </Seksjon>
                        <Seksjon>
                            {feilmelding && (
                                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                                    {feilmelding}
                                </AlertStripeFeilPreWrap>
                            )}
                        </Seksjon>
                        <Seksjon>
                            <Hovedknapp
                                hidden={!behandlingErRedigerbar}
                                htmlType="submit"
                                disabled={laster}
                            >
                                Lagre vedtak
                            </Hovedknapp>
                        </Seksjon>
                    </>
                )}
            </form>
        </Container>
    );
};

export default Sanksjonsfastsettelse;
