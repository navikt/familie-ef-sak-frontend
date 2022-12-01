import * as React from 'react';
import { FC } from 'react';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Redigeringsmodus } from './VisEllerEndreVurdering';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from './tekster';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { resultatTilTekst } from '../VedtakOgBeregning/Felles/ResultatVisning';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { Button, ErrorMessage, Heading } from '@navikt/ds-react';
import { Delete, Edit } from '@navikt/ds-icons';
import {
    SistOppdatertOgVurderingWrapper,
    VertikalStrek,
    VurderingLesemodusGrid,
    TittelOgKnappWrapper,
} from './StyledVurdering';
import {
    BodyShortSmall,
    DetailSmall,
    LabelSmallAsText,
} from '../../../Felles/Visningskomponenter/Tekster';

const StyledVilkår = styled.div`
    grid-column: 2/4;
    max-width: 40rem;

    .typo-normal {
        margin-top: 0.25rem;
        margin-bottom: 1.5rem;
    }
`;

const StyledFeilmelding = styled.div`
    grid-column: 2/4;
    max-width: 30rem;
`;

const StyledIkonOgTittel = styled.span`
    margin-bottom: 0.5rem;
    display: flex;

    svg {
        margin-right: 1rem;
    }
`;

const SistOppdatertTekst = styled(DetailSmall)`
    color: ${navFarger.navGra60};
`;

interface Props {
    vurdering: IVurdering;
    resetVurdering: () => void;
    feilmelding: string | undefined;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    behandlingErRedigerbar: boolean;
    tittelTekst?: string;
}

const VisVurdering: FC<Props> = ({
    settRedigeringsmodus,
    vurdering,
    resetVurdering,
    feilmelding,
    behandlingErRedigerbar,
    tittelTekst,
}) => {
    const vilkårsresultat = vurdering.resultat;
    const sistOppdatert = formaterIsoDatoTidMedSekunder(vurdering.endretTid);
    const vurderingerBesvartAvSaksbehandler = vurdering.delvilkårsvurderinger.filter(
        (delvilkårsvurdering) =>
            delvilkårsvurdering.resultat === Vilkårsresultat.OPPFYLT ||
            delvilkårsvurdering.resultat === Vilkårsresultat.AUTOMATISK_OPPFYLT ||
            delvilkårsvurdering.resultat === Vilkårsresultat.IKKE_OPPFYLT
    );
    const erAutomatiskVurdert = vurdering.delvilkårsvurderinger.every(
        (delvilkårsvurdering) => delvilkårsvurdering.resultat === Vilkårsresultat.AUTOMATISK_OPPFYLT
    );
    return (
        <VurderingLesemodusGrid key={vurdering.id}>
            <BrukerMedBlyantIkon />

            <TittelOgKnappWrapper>
                <StyledIkonOgTittel>
                    <Heading size={'small'} level={'3'}>
                        {tittelTekst
                            ? tittelTekst
                            : `Vilkår ${resultatTilTekst[vurdering.resultat]}`}
                        {erAutomatiskVurdert ? ` (automatisk)` : ``}
                    </Heading>
                </StyledIkonOgTittel>
                {behandlingErRedigerbar && (
                    <>
                        <div>
                            {vilkårsresultat !== Vilkårsresultat.SKAL_IKKE_VURDERES && (
                                <Button
                                    type={'button'}
                                    variant={'tertiary'}
                                    icon={<Edit />}
                                    onClick={() =>
                                        settRedigeringsmodus(Redigeringsmodus.REDIGERING)
                                    }
                                    size={'small'}
                                >
                                    <span>Rediger</span>
                                </Button>
                            )}

                            <Button
                                type={'button'}
                                variant={'tertiary'}
                                icon={<Delete />}
                                onClick={resetVurdering}
                                size={'small'}
                            >
                                <span>slett</span>
                            </Button>
                        </div>
                        {feilmelding && (
                            <StyledFeilmelding>
                                <ErrorMessage size={'small'}>
                                    Oppdatering av vilkår feilet: {feilmelding}
                                </ErrorMessage>{' '}
                            </StyledFeilmelding>
                        )}
                    </>
                )}
            </TittelOgKnappWrapper>

            <VertikalStrek />
            <SistOppdatertOgVurderingWrapper>
                {sistOppdatert &&
                    (vilkårsresultat === Vilkårsresultat.OPPFYLT ||
                        vilkårsresultat === Vilkårsresultat.AUTOMATISK_OPPFYLT ||
                        vilkårsresultat === Vilkårsresultat.IKKE_OPPFYLT) && (
                        <SistOppdatertTekst>Sist endret dato - {sistOppdatert}</SistOppdatertTekst>
                    )}
                <StyledVilkår>
                    {vurderingerBesvartAvSaksbehandler.map((delvilkårsvurdering) =>
                        delvilkårsvurdering.vurderinger.map((vurdering) => (
                            <React.Fragment key={vurdering.regelId}>
                                <div>
                                    <LabelSmallAsText>
                                        {delvilkårTypeTilTekst[vurdering.regelId]}
                                    </LabelSmallAsText>
                                    <BodyShortSmall>
                                        {vurdering.svar && svarTypeTilTekst[vurdering.svar]}
                                    </BodyShortSmall>
                                </div>

                                {vurdering.begrunnelse && (
                                    <>
                                        <LabelSmallAsText>Begrunnelse</LabelSmallAsText>
                                        <BreakWordNormaltekst>
                                            {vurdering.begrunnelse}
                                        </BreakWordNormaltekst>
                                    </>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </StyledVilkår>
            </SistOppdatertOgVurderingWrapper>
        </VurderingLesemodusGrid>
    );
};

export default VisVurdering;
