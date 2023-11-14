import React, { FC, useEffect } from 'react';
import { ITidligereVedtaksperioder } from './typer';
import { Registergrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { Button, Label, Link, Tag } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useHentHistoriskPensjon } from '../../../App/hooks/useHentHistoriskPensjon';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { TidligereVedtaksperiodeKort } from './TidligereVedtaksperiodeKort';
import { formatterBooleanEllerUkjent } from '../../../App/utils/formatter';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    text-align: left;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

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
    const tagVariant = tidligereVedtaksperioder.historiskPensjon ? 'success-filled' : 'neutral';

    return (
        <Container>
            <FlexDiv>
                <Registergrunnlag />
                <Label size="small" className="tittel" as="h3">
                    Har bruker tidligere vedtaksperioder i EF Sak eller Infotrygd
                </Label>
            </FlexDiv>
            <TidligereVedtaksperiodeKort tidligereVedtaksperioder={tidligereVedtaksperioder} />

            <FlexDiv>
                <Registergrunnlag />
                <SmallTextLabel>
                    Har bruker fått stønad før desember 2008 - <span>Infotrygd (PE PP)</span>
                </SmallTextLabel>
                <Tag variant={tagVariant}>
                    {formatterBooleanEllerUkjent(tidligereVedtaksperioder.historiskPensjon)}
                </Tag>
                {tidligereVedtaksperioder.historiskPensjon && <HistoriskpensjonLenke />}
            </FlexDiv>
        </Container>
    );
};

export default TidligereVedtaksperioderInfo;
