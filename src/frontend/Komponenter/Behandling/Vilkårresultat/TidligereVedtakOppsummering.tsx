import React from 'react';
import { IVurdering } from '../Inngangsvilkår/vilkår';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from '../Vurdering/tekster';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';
import styled from 'styled-components';

interface Props {
    tidligereVedtaksvilkår: IVurdering[];
}

const KomponentWrapper = styled.div`
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

const TidligereVedtakOppsummering: React.FC<Props> = ({ tidligereVedtaksvilkår }) => {
    return (
        <KomponentWrapper>
            {tidligereVedtaksvilkår.map((vurdering) => {
                return vurdering.delvilkårsvurderinger.map((delvilkår) => {
                    return delvilkår.vurderinger.map((vurdering) => {
                        return (
                            <DelvilkårWrapper>
                                <Undertittel>
                                    {delvilkårTypeTilTekst[vurdering.regelId]}
                                </Undertittel>
                                <TekstWrapper>
                                    {vurdering.svar && svarTypeTilTekst[vurdering.svar]}
                                </TekstWrapper>
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
