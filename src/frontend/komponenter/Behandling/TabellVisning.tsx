import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { StyledTabell } from '../Felleskomponenter/Visning/StyledTabell';

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
}

export interface Kolonndata<T> {
    ikon: TabellIkon;
    tittel: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
}

export interface Kolonner<T> {
    overskrift: string;
    tekstVerdi: (data: T) => string | undefined;
}

const mapIkon = (ikon: TabellIkon) => {
    switch (ikon) {
        case TabellIkon.REGISTER:
            return <Registergrunnlag />;
        case TabellIkon.SØKNAD:
            return <Søknadsgrunnlag />;
    }
};

function TabellVisning<T>(props: Kolonndata<T>): React.ReactElement<Kolonndata<T>> {
    const { ikon, tittel, verdier, kolonner } = props;
    return (
        <StyledTabell kolonner={kolonner.length + 1}>
            {mapIkon(ikon)}
            <Element className="tittel" tag="h3">
                {tittel}
            </Element>
            {kolonner.map((headerValue, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''}>
                    {headerValue.overskrift}
                </Element>
            ))}
            {verdier.map((item) =>
                kolonner.map((headerValue, index) => (
                    <Normaltekst className={index === 0 ? 'førsteDataKolonne' : 'kolonne'}>
                        {headerValue.tekstVerdi(item)}
                    </Normaltekst>
                ))
            )}
        </StyledTabell>
    );
}

export default TabellVisning;
