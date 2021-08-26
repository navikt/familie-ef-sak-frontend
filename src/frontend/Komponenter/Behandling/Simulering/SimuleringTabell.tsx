import { ISimuleringTabell } from './SimuleringTyper';
import React from 'react';
import styled from 'styled-components';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

const Tabell = styled.table`
    border-collapse: collapse;
`;

const ÅrHeader = styled.th`
    padding: 0.75rem;
    border-bottom: 1px solid ${navFarger.navGra80};
`;

const MånedHeader = styled.th`
    padding: 0.75rem;
    text-align: right;
    border-bottom: 1px solid ${navFarger.navGra80};
`;

const EtikettKolonne = styled.td`
    padding: 0.75rem;
    border-bottom: 1px solid ${navFarger.navGra20};
`;

const VerdiKolonne = styled.td`
    padding: 0.75rem;
    text-align: right;
    border-bottom: 1px solid ${navFarger.navGra20};
`;

const SimuleringTabell: React.FC<ISimuleringTabell> = (simuleringstabell) => {
    const { perioder, årsvelger } = simuleringstabell;
    return (
        <Tabell>
            <thead>
                <tr>
                    <ÅrHeader>
                        <Undertittel>{årsvelger.valgtÅr}</Undertittel>
                    </ÅrHeader>
                    {perioder.map((p) => {
                        return (
                            <MånedHeader key={p.måned}>
                                <Element>{p.måned}</Element>
                            </MånedHeader>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <EtikettKolonne>
                        <Element>Nytt beløp</Element>
                    </EtikettKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned}>
                                <Normaltekst>{p.nyttBeløp}</Normaltekst>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <EtikettKolonne>
                        <Element>Tidligere utbetalt</Element>
                    </EtikettKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned}>
                                <Normaltekst>{p.tidligereUtbetalt}</Normaltekst>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
                <tr>
                    <EtikettKolonne>
                        <Element>Resultat</Element>
                    </EtikettKolonne>
                    {perioder.map((p) => {
                        return (
                            <VerdiKolonne key={p.måned}>
                                <Normaltekst>{p.resultat}</Normaltekst>
                            </VerdiKolonne>
                        );
                    })}
                </tr>
            </tbody>
        </Tabell>
    );
};

export default SimuleringTabell;
