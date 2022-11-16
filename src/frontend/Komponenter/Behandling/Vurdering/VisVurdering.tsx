import * as React from 'react';
import { FC } from 'react';
import { Element, Feilmelding, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Redigeringsmodus } from './VisEllerEndreVurdering';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from './tekster';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { resultatTilTekst } from '../VedtakOgBeregning/Felles/ResultatVisning';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { Button } from '@navikt/ds-react';
import { Delete, Edit } from '@navikt/ds-icons';
import {
    SistOppdatertOgVurderingWrapper,
    StyledStrek,
    StyledVurderingLesemodus,
    TittelOgKnappWrapper,
} from './StyledVurdering';

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

const SistOppdatertTekst = styled(Undertekst)`
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
        <StyledVurderingLesemodus key={vurdering.id}>
            <BrukerMedBlyantIkon />

            <TittelOgKnappWrapper>
                <StyledIkonOgTittel>
                    <Undertittel>
                        {tittelTekst
                            ? tittelTekst
                            : `Vilkår ${resultatTilTekst[vurdering.resultat]}`}
                        {erAutomatiskVurdert ? ` (automatisk)` : ``}
                    </Undertittel>
                </StyledIkonOgTittel>
                {behandlingErRedigerbar && (
                    <>
                        <div>
                            <Button
                                type={'button'}
                                variant={'tertiary'}
                                icon={<Edit />}
                                hidden={vilkårsresultat === Vilkårsresultat.SKAL_IKKE_VURDERES}
                                onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                                size={'small'}
                            >
                                <span>Rediger</span>
                            </Button>
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
                                <Feilmelding>
                                    Oppdatering av vilkår feilet: {feilmelding}
                                </Feilmelding>{' '}
                            </StyledFeilmelding>
                        )}
                    </>
                )}
            </TittelOgKnappWrapper>

            <StyledStrek />
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
                                    <Element>{delvilkårTypeTilTekst[vurdering.regelId]}</Element>
                                    <Normaltekst>
                                        {vurdering.svar && svarTypeTilTekst[vurdering.svar]}
                                    </Normaltekst>
                                </div>

                                {vurdering.begrunnelse && (
                                    <>
                                        <Element>Begrunnelse</Element>
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
        </StyledVurderingLesemodus>
    );
};

export default VisVurdering;
