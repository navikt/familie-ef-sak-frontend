import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst as NormaltekstNavFrontend } from 'nav-frontend-typografi';
import { StyledTabell } from '../Felleskomponenter/Visning/StyledTabell';
import hiddenIf from '../Felleskomponenter/HiddenIf/hiddenIf';

const Normaltekst = hiddenIf(NormaltekstNavFrontend);

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
}

export interface Kolonndata<T> {
    ikon: TabellIkon;
    tittel: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
    onEmpty?: string;
}

interface TabellProps<T> {
    verdier: T[];
    kolonner: Kolonner<T>[];
    onEmpty?: string;
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
    }
};

function TabellVisning<T>(props: Kolonndata<T>): React.ReactElement<Kolonndata<T>> {
    const { ikon, tittel, verdier, kolonner, onEmpty } = props;
    return (
        <StyledTabell kolonner={kolonner.length + 1}>
            {mapIkon(ikon)}
            <Element className="tittel" tag="h3">
                {tittel}
            </Element>
            <Tabell verdier={verdier} kolonner={kolonner} onEmpty={onEmpty} />
        </StyledTabell>
    );
}

export function Tabell<T>(props: TabellProps<T>): React.ReactElement<TabellProps<T>> {
    const { verdier, kolonner, onEmpty } = props;
    return (
        <>
            {kolonner.map((kolonne, index) => (
                <Element className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                    {kolonne.overskrift}
                </Element>
            ))}
            <Normaltekst
                hidden={verdier.length > 0 || !onEmpty}
                className="førsteDataKolonne tomTabell"
            >
                {onEmpty}
            </Normaltekst>
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
    );
}

export default TabellVisning;
