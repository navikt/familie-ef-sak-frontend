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

interface TabellProps<T> {
    verdier: T[];
    kolonneInfo: Kolonner<T>[];
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
            <Tabell verdier={verdier} kolonneInfo={kolonner} />
        </StyledTabell>
    );
}

export function Tabell<T>(props: TabellProps<T>): React.ReactElement<TabellProps<T>> {
    const { verdier, kolonneInfo } = props;
    return (
        <>
            {kolonneInfo.map((kolonne, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                    {kolonne.overskrift}
                </Element>
            ))}
            {verdier.map((item) =>
                kolonneInfo.map((kolonne, index) => (
                    <Normaltekst
                        className={index === 0 ? 'førsteDataKolonne' : 'kolonne'}
                        key={index}
                    >
                        {kolonne.tekstVerdi(item) || ''}
                    </Normaltekst>
                ))
            )}
        </>
    );
}

export default TabellVisning;
