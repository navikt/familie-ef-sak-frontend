import React from 'react';
import { IVurdering, Vilkårsresultat, Vurdering } from '../../Inngangsvilkår/vilkår';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from '../../Vurdering/tekster';
import styled from 'styled-components';
import { VilkårsresultatIkon } from '../../../../Felles/Ikoner/VilkårsresultatIkon';
import { BodyLong, Heading, Label } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { harVerdi } from '../../../../App/utils/utils';

interface Props {
    tidligereVedtaksvilkår: IVurdering[];
}

const Container = styled.div`
    flex: 1 0 30rem;
    padding: 1rem;
    background-color: ${AGray50};
`;

const Div = styled.div`
    margin-top: 0.5rem;
    max-width: 46rem;
`;

const FlexBox = styled.div`
    display: flex;
    gap: 0.3rem;
    flex-wrap: wrap;
    align-items: center;
`;

const Bold = styled.span`
    font-weight: bold;
`;

const TidligereVedtakOppsummering: React.FC<Props> = ({ tidligereVedtaksvilkår }) => {
    return (
        <Container>
            <Heading spacing size="small">
                Tidligere vedtaksperioder
            </Heading>
            {tidligereVedtaksvilkår.map((vurdering, index) =>
                vurdering.delvilkårsvurderinger.map((delvilkår) =>
                    delvilkår.vurderinger.map((vurdering) => (
                        <SpørsmålOgSvarMedBegrunnelse key={index} vurdering={vurdering} />
                    ))
                )
            )}
        </Container>
    );
};

const SpørsmålOgSvarMedBegrunnelse: React.FC<{ vurdering: Vurdering }> = ({ vurdering }) => {
    const { regelId, svar, begrunnelse } = vurdering;
    return (
        <Div>
            <SpørsmålOgSvar regelId={regelId} svar={svar} />
            <Begrunnelse begrunnelse={begrunnelse} />
        </Div>
    );
};

const SpørsmålOgSvar: React.FC<{ regelId: string; svar: string | undefined }> = ({
    regelId,
    svar,
}) =>
    harVerdi(svar) && svar ? (
        <BodyLong size="small">
            <Bold>{delvilkårTypeTilTekst[regelId]}: </Bold>
            {svarTypeTilTekst[svar]}
        </BodyLong>
    ) : (
        <>
            <Label as={'p'} size="small">
                {delvilkårTypeTilTekst[regelId]}:
            </Label>
            <FlexBox>
                <VilkårsresultatIkon vilkårsresultat={Vilkårsresultat.IKKE_TATT_STILLING_TIL} />
                <BodyLong size="small">Du har ikke tatt stilling til dette</BodyLong>
            </FlexBox>
        </>
    );

const Begrunnelse: React.FC<{ begrunnelse: string | undefined }> = ({ begrunnelse }) =>
    harVerdi(begrunnelse) && begrunnelse ? (
        <BodyLong size="small">
            <Bold>Begrunnelse: </Bold>
            {begrunnelse}
        </BodyLong>
    ) : null;

export default TidligereVedtakOppsummering;
