import * as React from 'react';
import { FC } from 'react';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
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
    SmallTextLabel,
} from '../../../Felles/Visningskomponenter/Tekster';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

const StyledVilkår = styled.div`
    grid-column: 2/4;
    max-width: 40rem;
`;

const TekstMedSpacing = styled(BodyShortSmall)`
    margin-top: 0.25rem;
    margin-bottom: 1rem;
`;

const BreakWordTekstMedSpacing = styled(BreakWordNormaltekst)`
    margin-top: 0.25rem;
    margin-bottom: 1.5rem;
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
    color: ${ATextSubtle};
`;

interface Props {
    vurdering: IVurdering;
    resetVurdering: () => void;
    feilmelding: string | undefined;
    startRedigering: () => void;
    behandlingErRedigerbar: boolean;
    tittelTekst?: string;
}

const VisVurdering: FC<Props> = ({
    startRedigering,
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
                                    onClick={startRedigering}
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
                                    <SmallTextLabel>
                                        {delvilkårTypeTilTekst[vurdering.regelId]}
                                    </SmallTextLabel>
                                    <TekstMedSpacing>
                                        {vurdering.svar && svarTypeTilTekst[vurdering.svar]}
                                    </TekstMedSpacing>
                                </div>

                                {vurdering.begrunnelse && (
                                    <>
                                        <SmallTextLabel>Begrunnelse</SmallTextLabel>
                                        <BreakWordTekstMedSpacing>
                                            {vurdering.begrunnelse}
                                        </BreakWordTekstMedSpacing>
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
