import * as React from 'react';
import { RegisterGrunnlag, SøknadGrunnlag } from '../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { StyledTabell } from '../Felleskomponenter/Visning/StyledTabell';

export enum TabellIkone {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
}

export interface Kolonndata<T> {
    ikone: TabellIkone;
    tittel: string;
    data: T[];
    headerValues: HeaderValue<T>[];
}

export interface HeaderValue<T> {
    header: string;
    value: (data: T) => string | undefined;
}

const mapIkone = (ikone: TabellIkone) => {
    switch (ikone) {
        case TabellIkone.REGISTER:
            return <RegisterGrunnlag />;
        case TabellIkone.SØKNAD:
            return <SøknadGrunnlag />;
    }
};

const TabellVisning: React.FC<Kolonndata<any>> = ({ ikone, tittel, data, headerValues }) => {
    return (
        <StyledTabell kolonner={headerValues.length + 1}>
            {mapIkone(ikone)}
            <Element className="tittel">{tittel}</Element>
            {headerValues.map((headerValue, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''}>
                    {headerValue.header}
                </Element>
            ))}
            {data.map((item) =>
                headerValues.map((headerValue, index) => (
                    <Normaltekst className={index === 0 ? 'førsteDataKolonne' : 'kolonne'}>
                        {headerValue.value(item)}
                    </Normaltekst>
                ))
            )}
        </StyledTabell>
    );
};

export default TabellVisning;
