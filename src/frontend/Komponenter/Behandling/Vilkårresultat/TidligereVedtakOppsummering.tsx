import React from 'react';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from '../Vurdering/tekster';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import styled from 'styled-components';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import { BodyLong, Heading, Label } from '@navikt/ds-react';

interface Props {
    tidligereVedtaksvilkår: IVurdering[];
}

const TekstWrapper = styled.div`
    padding-top: 0.5rem;
`;

const BegrunnelseWrapper = styled.div`
    padding-top: 1rem;
`;

const Ikontekst = styled(Normaltekst)`
    padding-top: 0.15rem;
    margin-left: 0.25rem;
`;

const Container = styled.div`
    margin-top: 0.5rem;
`;

const TidligereVedtakOppsummering: React.FC<Props> = ({ tidligereVedtaksvilkår }) => {
    return (
        <>
            <Heading spacing size="small" level="5">
                Tidligere vedtaksperioder
            </Heading>
            {tidligereVedtaksvilkår.map((vurdering, index) => {
                return vurdering.delvilkårsvurderinger.map((delvilkår) => {
                    return delvilkår.vurderinger.map((vurdering) => {
                        return (
                            <Container key={index}>
                                <Label size="small">
                                    {delvilkårTypeTilTekst[vurdering.regelId]}
                                </Label>
                                {!vurdering.svar && (
                                    <FlexDiv flexDirection="row" className="blokk-xxs">
                                        <VilkårsresultatIkon
                                            vilkårsresultat={Vilkårsresultat.IKKE_TATT_STILLING_TIL}
                                        />
                                        <Ikontekst>Du har ikke tatt stilling til dette</Ikontekst>
                                    </FlexDiv>
                                )}
                                {vurdering.svar && (
                                    <TekstWrapper>
                                        <BodyLong size="small">
                                            {svarTypeTilTekst[vurdering.svar]}
                                        </BodyLong>
                                    </TekstWrapper>
                                )}
                                {vurdering.begrunnelse && (
                                    <BegrunnelseWrapper>
                                        <Element>Begrunnelse</Element>{' '}
                                        <TekstWrapper>
                                            <BreakWordNormaltekst>
                                                {vurdering.begrunnelse}
                                            </BreakWordNormaltekst>
                                        </TekstWrapper>
                                    </BegrunnelseWrapper>
                                )}
                            </Container>
                        );
                    });
                });
            })}
        </>
    );
};

export default TidligereVedtakOppsummering;
