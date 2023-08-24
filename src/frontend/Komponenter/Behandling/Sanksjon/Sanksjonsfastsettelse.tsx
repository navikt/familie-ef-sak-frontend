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
} from '../../../App/typer/Sanksjonsårsak';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import {
    EAktivitet,
    EBehandlingResultat,
    EPeriodetype,
    ISanksjonereVedtakDto,
    ISanksjonereVedtakForOvergangsstønad,
    IVedtak,
    IVedtakType,
} from '../../../App/typer/vedtak';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import useFormState, { FormState } from '../../../App/hooks/felles/useFormState';

import { FieldState } from '../../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../../Felles/Input/TekstInput/EnsligTextArea';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import {
    antallDagerIgjenAvNåværendeMåned,
    nesteMånedOgNesteMånedsÅrFormatert,
    nåværendeÅrOgMånedFormatert,
    SANKSJONERE_VEDTAK,
    validerSanksjonereVedtakForm,
} from './utils';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandling } from '../../../App/typer/fagsak';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { EnsligFamilieSelect } from '../../../Felles/Input/EnsligFamilieSelect';
import { AlertInfo, AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { EnsligErrorMessage } from '../../../Felles/ErrorMessage/EnsligErrorMessage';
import { Button, Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { useRedirectEtterLagring } from '../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';

export type SanksjonereVedtakForm = ISanksjonereVedtakDto;

const SanksjonVelger = styled(EnsligFamilieSelect)`
    margin-top: 1rem;
    max-width: 40rem;
`;

const Container = styled.div`
    margin: 2rem;
`;

const Seksjon = styled.div`
    margin-top: 2rem;
`;

const TekstMedMargin = styled(BodyShortSmall)`
    margin-top: 1rem;
`;

const InfoVisning = styled(AlertInfo)`
    max-width: 60rem;

    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const AdvarselVisning = styled(AlertWarning)`
    margin-top: 1.5rem;
    max-width: 60rem;

    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

interface Props {
    behandlingId: string;
}

const Sanksjonsfastsettelse: FC<Props> = ({ behandlingId }) => {
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);
    const { behandling } = useBehandling();
    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);
    return (
        <DataViewer response={{ vedtak, behandling }}>
            {({ vedtak, behandling }) => {
                return (
                    <SanksjonsvedtakVisning
                        behandling={behandling}
                        lagretVedtak={vedtak}
                        key={'sanksjonsvedtakVisning'}
                    />
                );
            }}
        </DataViewer>
    );
};

const SanksjonsvedtakVisning: FC<{
    behandling: Behandling;
    lagretVedtak?: IVedtak;
}> = ({ behandling, lagretVedtak }) => {
    const lagretSanksjonertVedtak =
        lagretVedtak?._type === IVedtakType.Sanksjonering
            ? (lagretVedtak as ISanksjonereVedtakForOvergangsstønad)
            : undefined;
    const [feilmelding, settFeilmelding] = useState<string>();
    const { hentBehandling, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();
    const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);
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

    const håndterVedtaksresultat =
        (): ((res: RessursSuksess<string> | RessursFeilet) => void) =>
        (res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                utførRedirect();
                hentBehandling.rerun();
            } else {
                settIkkePersistertKomponent(uuidv4());
                settFeilmelding(res.frontendFeilmelding);
            }
        };

    const lagreVedtak = (vedtaksRequest: ISanksjonereVedtakForOvergangsstønad) => {
        settLaster(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, ISanksjonereVedtakForOvergangsstønad>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
            data: vedtaksRequest,
        })
            .then(håndterVedtaksresultat())
            .finally(() => {
                settLaster(false);
            });
    };

    const handleSubmit = (form: FormState<SanksjonereVedtakForm>) => {
        const årOgMåned = nesteMånedOgNesteMånedsÅrFormatert();
        const vedtaksRequest: ISanksjonereVedtakForOvergangsstønad = {
            resultatType: EBehandlingResultat.SANKSJONERE,
            sanksjonsårsak: form.sanksjonsårsak,
            internBegrunnelse: form.internBegrunnelse,
            periode: {
                periodeType: EPeriodetype.SANKSJON,
                aktivitet: EAktivitet.IKKE_AKTIVITETSPLIKT,
                årMånedFra: årOgMåned,
                årMånedTil: årOgMåned,
            },
            _type: IVedtakType.Sanksjonering,
        };
        lagreVedtak(vedtaksRequest);
    };

    const dagerIgjenAvMåned = antallDagerIgjenAvNåværendeMåned();

    return (
        <Container>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <section>
                    <Heading size={'small'} level={'3'}>
                        Sanksjon
                    </Heading>
                    <SanksjonVelger
                        label="Brukeren har uten rimelig grunn:"
                        value={sanksjonårsak.value}
                        onChange={(e) => {
                            settIkkePersistertKomponent(SANKSJONERE_VEDTAK);
                            sanksjonårsak.onChange(e);
                        }}
                        erLesevisning={!behandlingErRedigerbar}
                        lesevisningVerdi={
                            sanksjonsårsakTilTekst[sanksjonårsak.value as Sanksjonsårsak]
                        }
                    >
                        <option value="" key={'velg'}>
                            Velg
                        </option>
                        {sanksjonsårsaker.map((sanksjonsårsak: Sanksjonsårsak) => (
                            <option
                                key={sanksjonsårsakTilTekst[sanksjonsårsak]}
                                value={sanksjonsårsak}
                            >
                                {sanksjonsårsakTilTekst[sanksjonsårsak]}
                            </option>
                        ))}
                    </SanksjonVelger>
                    <EnsligErrorMessage>{formState.errors.sanksjonsårsak}</EnsligErrorMessage>
                </section>
                {sanksjonårsak.value && (
                    <>
                        <Seksjon>
                            <Heading size={'small'} level={'3'}>
                                Sanksjonsperiode
                            </Heading>
                            <TekstMedMargin>
                                Måneden for sanksjon er{' '}
                                <b>
                                    {nåværendeÅrOgMånedFormatert(
                                        !behandlingErRedigerbar
                                            ? lagretSanksjonertVedtak?.periode.årMånedFra
                                            : ''
                                    )}
                                </b>{' '}
                                som er måneden etter dette vedtaket. Bruker vil ikke få utbetalt
                                stønad i denne perioden.
                            </TekstMedMargin>
                        </Seksjon>
                        <Seksjon>
                            <InfoVisning>
                                {sanksjonInfoDel1}
                                <ul>
                                    <li key={behandling.stønadstype}>
                                        {stønadstypeTilTekst[behandling.stønadstype]}
                                    </li>
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
                            {behandlingErRedigerbar && (
                                <Button type="submit" disabled={laster}>
                                    Lagre vedtak
                                </Button>
                            )}
                        </Seksjon>
                    </>
                )}
            </form>
        </Container>
    );
};

export default Sanksjonsfastsettelse;
