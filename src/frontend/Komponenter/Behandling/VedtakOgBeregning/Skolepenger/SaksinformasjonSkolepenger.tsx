import React from 'react';
import {
    AktivitetsvilkårType,
    IVilkår,
    RegelIdDDokumentasjonUtdanning,
} from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { UtdanningsformTilTekst } from '../../Aktivitet/Aktivitet/typer';
import { formaterTilIsoDatoFraTilStreng, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import {
    utledBegrunnelseFraVilkårOgRegel,
    utledVisningForStudiebelastning,
} from '../../Inngangsvilkår/utils';
import {
    BodyLongSmall,
    BodyShortSmall,
    DetailSmall,
} from '../../../../Felles/Visningskomponenter/Tekster';
import { ABorderDivider, AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${AGray50};
    width: 26rem;

    .spacing {
        margin-top: 3.5rem;
    }
`;

const Divider = styled.div`
    border-bottom: 1px solid ${ABorderDivider};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content) 13rem;
    gap: 0.5rem;
`;

const FlexCenter = styled(DetailSmall)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 9.3rem;
`;

const BreakWordBody = styled(BodyLongSmall)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const HøyrestiltBodyShort = styled(BodyShortSmall)`
    text-align: right;
    width: 6.25rem;
`;

type Props = {
    skalViseSøknadsinfo: boolean;
    utdanning?: IUnderUtdanning;
    vilkår: IVilkår;
};
export const SøknadsinformasjonUtdanning: React.FC<Props> = ({
    skalViseSøknadsinfo,
    utdanning,
    vilkår,
}) => (
    <Container>
        <Heading size="small" level="5">
            Søknadsinformasjon - Utdanning
        </Heading>
        {utdanning && skalViseSøknadsinfo ? (
            <Grid>
                <Søknadsgrunnlag />
                <BodyShortSmall>Skole/utdanningssted</BodyShortSmall>
                <BodyShortSmall>{utdanning.skoleUtdanningssted}</BodyShortSmall>
                <Søknadsgrunnlag />
                <BodyShortSmall>Linje/kurs/grad</BodyShortSmall>
                <BodyShortSmall>{utdanning.linjeKursGrad}</BodyShortSmall>
                <Søknadsgrunnlag />
                <BodyShortSmall>Utdanningstype</BodyShortSmall>
                <BodyShortSmall>
                    {UtdanningsformTilTekst[utdanning.offentligEllerPrivat]}
                </BodyShortSmall>
                <Søknadsgrunnlag />
                <BodyShortSmall>Studieperiode</BodyShortSmall>
                <BodyShortSmall>
                    {formaterTilIsoDatoFraTilStreng(utdanning.fra, utdanning.til)}
                </BodyShortSmall>
                <Søknadsgrunnlag />
                <BodyShortSmall>Studiebelastning</BodyShortSmall>
                <BodyShortSmall>{utledVisningForStudiebelastning(utdanning)}</BodyShortSmall>
            </Grid>
        ) : (
            <FlexCenter>Ingen informasjon å vise</FlexCenter>
        )}
        <Divider />
        <SaksbehandlerVurdering
            vilkår={vilkår}
            regelId={RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTDANNING}
        />
    </Container>
);

export const SøknadsinformajsonUtgifter: React.FC<Props> = ({
    utdanning,
    skalViseSøknadsinfo,
    vilkår,
}) => {
    return (
        <Container>
            <Heading size="small">Søknadsinformasjon - Utgifter</Heading>
            {utdanning && skalViseSøknadsinfo ? (
                <Grid>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Semesteravgift</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.semesteravgift)}
                    </HøyrestiltBodyShort>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Studieavgift</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.studieavgift)}
                    </HøyrestiltBodyShort>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Eksamemensgebyr</BodyShortSmall>
                    <HøyrestiltBodyShort>
                        {utledUtgiftsbeløp(utdanning.eksamensgebyr)}
                    </HøyrestiltBodyShort>
                </Grid>
            ) : (
                <FlexCenter>Ingen informasjon å vise</FlexCenter>
            )}
            <Divider className="spacing" />
            <SaksbehandlerVurdering
                vilkår={vilkår}
                regelId={RegelIdDDokumentasjonUtdanning.DOKUMENTASJON_AV_UTGIFTER_UTDANNING}
            />
        </Container>
    );
};

const SaksbehandlerVurdering: React.FC<{
    vilkår: IVilkår;
    regelId: RegelIdDDokumentasjonUtdanning;
}> = ({ vilkår, regelId }) => {
    const saksbehandlerBegrunnelse = utledBegrunnelseFraVilkårOgRegel(
        vilkår.vurderinger,
        AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING,
        regelId
    );

    return (
        <div>
            <Heading size="small">Saksbehandlers vurdering</Heading>
            {saksbehandlerBegrunnelse ? (
                <BreakWordBody>{saksbehandlerBegrunnelse}</BreakWordBody>
            ) : (
                <DetailSmall>Ingen begrunnelse</DetailSmall>
            )}
        </div>
    );
};
