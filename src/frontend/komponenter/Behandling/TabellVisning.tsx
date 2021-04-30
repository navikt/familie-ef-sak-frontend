import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst as NormaltekstNavFrontend } from 'nav-frontend-typografi';
import { GridTabell } from '../Felleskomponenter/Visning/StyledTabell';
import hiddenIf from '../Felleskomponenter/HiddenIf/hiddenIf';
import { Calculator } from '@navikt/ds-icons';

const Normaltekst = hiddenIf(NormaltekstNavFrontend);

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
}

export interface Kolonndata<T> {
    ikon?: TabellIkon;
    tittel: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
}

export interface Kolonner<T> {
    overskrift: string;
    tekstVerdi: (data: T) => React.ReactNode;
}

const mapIkon = (ikon: TabellIkon) => {
    switch (ikon) {
        case TabellIkon.REGISTER:
            return <Registergrunnlag />;
        case TabellIkon.SØKNAD:
            return <Søknadsgrunnlag />;
        case TabellIkon.KALKULATOR:
            return <Calculator />;
    }
};

function TabellVisning<T>(props: Kolonndata<T>): React.ReactElement<Kolonndata<T>> {
    const { ikon, tittel, verdier, kolonner } = props;
    return (
        <GridTabell kolonner={kolonner.length + 1} utenIkon={!ikon}>
            {ikon && mapIkon(ikon)}
            <Element className="tittel" tag="h3">
                {tittel}
            </Element>
            <>
                {kolonner.map((kolonne, index) => (
                    <Element className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                        {kolonne.overskrift}
                    </Element>
                ))}
                {verdier.map((item) =>
                    kolonner.map((kolonne, index) => (
                        <Normaltekst
                            className={index === 0 ? 'førsteDataKolonne' : 'kolonne'}
                            key={index}
                        >
                            {kolonne.tekstVerdi(item) || ''}
                        </Normaltekst>
                    ))
                )}
            </>
        </GridTabell>
    );
}

export default TabellVisning;
