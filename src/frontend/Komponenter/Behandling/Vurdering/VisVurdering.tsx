import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from './tekster';
import { BrukerMedBlyantIkon, CogIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { BreakWordBodyLongSmall } from '../../../Felles/Visningskomponenter/BreakWordBodyLongSmall';
import { formaterIsoDatoTidMedSekunder } from '../../../App/utils/formatter';
import { Button, ErrorMessage } from '@navikt/ds-react';
import { TrashIcon, PencilIcon, RecycleIcon } from '@navikt/aksel-icons';

import {
    SistOppdatertOgVurderingWrapper,
    TittelOgKnappWrapper,
    VertikalStrek,
    VurderingLesemodusGrid,
} from './StyledVurdering';
import {
    BodyShortSmall,
    DetailSmall,
    SmallTextLabel,
} from '../../../Felles/Visningskomponenter/Tekster';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';
import { utledSkalViseGjenbrukKnapp } from './utils';
import { ModalGjenbrukVilkårsvurdering } from './ModalGjenbrukVilkårsvurdering';
import { LagTittel } from './LagTittel';

const StyledVilkår = styled.div`
    grid-column: 2/4;
    max-width: 40rem;
`;

const TekstMedSpacing = styled(BodyShortSmall)`
    margin-top: 0.25rem;
    margin-bottom: 1rem;
`;

const BreakWordTekstMedSpacing = styled(BreakWordBodyLongSmall)`
    margin-top: 0.25rem;
    margin-bottom: 1.5rem;
`;

const StyledFeilmelding = styled.div`
    grid-column: 2/4;
    max-width: 30rem;
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
    gjenbrukVilkårsvurdering: () => void;
    gjenbrukbareVilkårsvurderinger: string[];
}

const VisVurdering: FC<Props> = ({
    startRedigering,
    vurdering,
    resetVurdering,
    feilmelding,
    behandlingErRedigerbar,
    gjenbrukVilkårsvurdering,
    gjenbrukbareVilkårsvurderinger,
}) => {
    const [visModal, settVisModal] = React.useState<boolean>(false);
    const vilkårsresultat = vurdering.resultat;
    const sistOppdatert = formaterIsoDatoTidMedSekunder(
        vurdering.opphavsvilkår?.endretTid || vurdering.endretTid
    );
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
            {erAutomatiskVurdert && <CogIkon />}
            {!erAutomatiskVurdert && <BrukerMedBlyantIkon />}

            <TittelOgKnappWrapper>
                <LagTittel vurdering={vurdering} erAutomatiskVurdert={erAutomatiskVurdert} />
                {behandlingErRedigerbar && (
                    <>
                        <div>
                            {vilkårsresultat !== Vilkårsresultat.SKAL_IKKE_VURDERES && (
                                <Button
                                    type={'button'}
                                    variant={'tertiary'}
                                    icon={<PencilIcon />}
                                    onClick={startRedigering}
                                    size={'small'}
                                >
                                    <span>Rediger</span>
                                </Button>
                            )}

                            <Button
                                type={'button'}
                                variant={'tertiary'}
                                icon={<TrashIcon />}
                                onClick={resetVurdering}
                                size={'small'}
                            >
                                <span>Slett</span>
                            </Button>
                            {utledSkalViseGjenbrukKnapp(
                                vurdering,
                                gjenbrukbareVilkårsvurderinger
                            ) && (
                                <Button
                                    type={'button'}
                                    variant={'tertiary'}
                                    icon={<RecycleIcon />}
                                    onClick={() => settVisModal(true)}
                                    size={'small'}
                                >
                                    Gjenbruk
                                </Button>
                            )}
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

            <ModalGjenbrukVilkårsvurdering
                visModal={visModal}
                settVisModal={settVisModal}
                gjenbrukVilkårsvurdering={gjenbrukVilkårsvurdering}
                vilkårType={vurdering.vilkårType}
            />

            <VertikalStrek />
            <SistOppdatertOgVurderingWrapper>
                {(vilkårsresultat === Vilkårsresultat.OPPFYLT ||
                    vilkårsresultat === Vilkårsresultat.AUTOMATISK_OPPFYLT ||
                    vilkårsresultat === Vilkårsresultat.IKKE_OPPFYLT) && (
                    <SistOppdatertTekst>
                        Sist endret dato - {sistOppdatert}
                        {vurdering.opphavsvilkår ? ` (gjenbrukt)` : ``}
                    </SistOppdatertTekst>
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
