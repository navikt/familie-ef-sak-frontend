import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';

const GridTabell = styled.div<{
    kolonner?: number;
    utenIkon: boolean;
}>`
    display: grid;
    grid-template-columns: ${(props) => props.utenIkon && '21px'} min(200px, 250px) repeat(
            ${(props) => (props.kolonner ? props.kolonner - 2 : 2)},
            ${(props) => (props.kolonner && props.kolonner > 3 ? '150px' : '325px')}
        );
    grid-gap: 0.5rem;
    .tittel {
        padding-bottom: 0.25rem;
        grid-column: ${(props) => (props.utenIkon ? 2 : 1)} /
            ${(props) => (props.kolonner || 3) + 1};
        display: flex;
        align-items: center;
    }
    .førsteDataKolonne {
        grid-column: ${(props) => (props.utenIkon ? '2/3' : '1/2')};
    }
`;

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
}

export interface Kolonndata<T> {
    ikon?: TabellIkon;
    tittel: string;
    tittelType?: 'element' | 'undertittel';
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

            <Heading size="small" className="tittel" level={'3'}>
                {tittel}
            </Heading>

            <>
                {kolonner.map((kolonne, index) => (
                    <SmallTextLabel className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                        {kolonne.overskrift}
                    </SmallTextLabel>
                ))}
                {verdier.map((item) =>
                    kolonner.map((kolonne, index) => (
                        <BodyShortSmall
                            className={index === 0 ? 'førsteDataKolonne' : 'kolonne'}
                            key={index}
                        >
                            {kolonne.tekstVerdi(item) || ''}
                        </BodyShortSmall>
                    ))
                )}
            </>
        </GridTabell>
    );
}

export default TabellVisning;
