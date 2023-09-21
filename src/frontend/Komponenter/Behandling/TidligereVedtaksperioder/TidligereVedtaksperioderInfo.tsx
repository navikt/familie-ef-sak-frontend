import React, { FC, useEffect } from 'react';
import { ITidligereVedtaksperioder } from './typer';
import TabellVisning from '../Tabell/TabellVisning';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';
import { Registergrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { Button, Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useHentHistoriskPensjon } from '../../../App/hooks/useHentHistoriskPensjon';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { VilkårInfoIkon } from '../Vilkårpanel/VilkårInformasjonKomponenter';

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const DivMedBottomMargin = styled.div`
    margin-bottom: 2rem;
`;

const TabellTidligereVedtaksperioder: React.FC<ITidligereVedtaksperioder> = ({
    infotrygd,
    sak,
}) => {
    if (!infotrygd && !sak) {
        return null;
    }
    return (
        <TabellVisning<{
            stønad: Stønadstype;
            verdi: { sak?: boolean; infotrygd?: boolean };
        }>
            ikon={VilkårInfoIkon.REGISTER}
            tittel="Har bruker tidligere vedtaksperioder i EF Sak eller Infotrygd"
            verdier={[
                {
                    stønad: Stønadstype.OVERGANGSSTØNAD,
                    verdi: {
                        sak: sak?.harTidligereOvergangsstønad,
                        infotrygd: infotrygd?.harTidligereOvergangsstønad,
                    },
                },
                {
                    stønad: Stønadstype.BARNETILSYN,
                    verdi: {
                        sak: sak?.harTidligereBarnetilsyn,
                        infotrygd: infotrygd?.harTidligereBarnetilsyn,
                    },
                },
                {
                    stønad: Stønadstype.SKOLEPENGER,
                    verdi: {
                        sak: sak?.harTidligereSkolepenger,
                        infotrygd: infotrygd?.harTidligereSkolepenger,
                    },
                },
            ]}
            kolonner={[
                {
                    overskrift: 'Stønad',
                    tekstVerdi: (d) => stønadstypeTilTekst[d.stønad],
                },
                {
                    overskrift: 'Historikk i Infotrygd',
                    tekstVerdi: (d) => formatterBooleanEllerUkjent(!!d.verdi.infotrygd),
                },
                {
                    overskrift: 'Historikk i EF Sak',
                    tekstVerdi: (d) => formatterBooleanEllerUkjent(!!d.verdi.sak),
                },
            ]}
        />
    );
};

const HistoriskpensjonLenke: React.FC = () => {
    const { hentForFagsakId, historiskPensjon } = useHentHistoriskPensjon();

    const { behandling } = useBehandling();

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            hentForFagsakId(behandling.data.fagsakId);
        }
    }, [behandling, hentForFagsakId]);

    return historiskPensjon.status === RessursStatus.SUKSESS ? (
        <Link href={historiskPensjon.data.webAppUrl} target={'_blank'}>
            <Button
                type={'button'}
                as={'p'}
                size={'small'}
                variant={'tertiary'}
                icon={<ExternalLinkIcon />}
                iconPosition={'right'}
            >
                Se vedtaksperioder
            </Button>
        </Link>
    ) : null;
};

const TidligereVedtaksperioderInfo: FC<{ tidligereVedtaksperioder: ITidligereVedtaksperioder }> = ({
    tidligereVedtaksperioder,
}) => {
    return (
        <>
            <DivMedBottomMargin>
                <TabellTidligereVedtaksperioder
                    infotrygd={tidligereVedtaksperioder.infotrygd}
                    sak={tidligereVedtaksperioder.sak}
                />
            </DivMedBottomMargin>

            <FlexDiv>
                <Registergrunnlag />
                <SmallTextLabel>
                    Har bruker fått stønad før desember 2008 - <span>Infotrygd (PE PP)</span>
                </SmallTextLabel>
                <BodyShortSmall>
                    {formatterBooleanEllerUkjent(tidligereVedtaksperioder.historiskPensjon)}
                </BodyShortSmall>
                {tidligereVedtaksperioder.historiskPensjon && <HistoriskpensjonLenke />}
            </FlexDiv>
        </>
    );
};

export default TidligereVedtaksperioderInfo;
