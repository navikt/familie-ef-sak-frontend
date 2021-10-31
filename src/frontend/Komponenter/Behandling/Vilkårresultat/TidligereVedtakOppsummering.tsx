import React from 'react';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from '../Vurdering/tekster';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import styled from 'styled-components';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';

interface Props {
    tidligereVedtaksvilkår: IVurdering[];
}

const KomponentWrapper = styled.div`
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
`;

const DelvilkårWrapper = styled.div`
    padding-top: 1rem;
`;

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

const TidligereVedtakOppsummering: React.FC<Props> = ({ tidligereVedtaksvilkår }) => {
    return (
        <KomponentWrapper>
            <Undertittel>Tidligere vedtaksperioder</Undertittel>
            {tidligereVedtaksvilkår.map((vurdering) => {
                return vurdering.delvilkårsvurderinger.map((delvilkår) => {
                    return delvilkår.vurderinger.map((vurdering) => {
                        return (
                            <DelvilkårWrapper>
                                <Element>{delvilkårTypeTilTekst[vurdering.regelId]}</Element>
                                {!vurdering.svar && (
                                    <FlexDiv flexDirection="row" className="blokk-xxs">
                                        <VilkårsresultatIkon
                                            vilkårsresultat={Vilkårsresultat.IKKE_TATT_STILLING_TIL}
                                        />
                                        <Ikontekst>Du har ikke tatt stilling til dette</Ikontekst>
                                    </FlexDiv>
                                )}
                                {vurdering.svar && (
                                    <TekstWrapper>{svarTypeTilTekst[vurdering.svar]}</TekstWrapper>
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
                            </DelvilkårWrapper>
                        );
                    });
                });
            })}
        </KomponentWrapper>
    );
};

export default TidligereVedtakOppsummering;
