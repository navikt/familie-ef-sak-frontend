import * as React from 'react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { Detail, HelpText, Label } from '@navikt/ds-react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';

const GridTabell = styled.div<{
    kolonner?: number;
    ikonVisning: boolean;
}>`
    display: grid;
    grid-template-columns: ${(props) => props.ikonVisning && '21px'} min(200px, 250px) repeat(
            ${(props) => (props.kolonner ? props.kolonner - 2 : 2)},
            ${(props) => (props.kolonner && props.kolonner > 3 ? '150px' : '325px')}
        );
    grid-gap: 0.5rem;
    .tittel {
        padding-bottom: 0.25rem;
        grid-column: ${(props) => (props.ikonVisning ? 2 : 1)} /
            ${(props) => (props.kolonner || 3) + 1};
        display: flex;
        align-items: center;
    }
    .førsteDataKolonne {
        grid-column: ${(props) => (props.ikonVisning ? '2/3' : '1/2')};
    }
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 1rem;
`;
export interface Kolonnedata<T> {
    ikon?: TabellIkon;
    tittel?: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
}

export interface Kolonner<T> {
    overskrift: string;
    hjelpetekst?: string;
    tekstVerdi: (data: T) => React.ReactNode;
}

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
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

function TabellVisning<T>(props: Kolonnedata<T>): React.ReactElement<Kolonnedata<T>> {
    const { ikon, tittel, verdier, kolonner } = props;
    return (
        <GridTabell kolonner={kolonner.length + 1} ikonVisning={!!ikon}>
            {ikon && mapIkon(ikon)}
            {tittel && (
                <Label size="small" className="tittel" as="h3">
                    {tittel}
                </Label>
            )}
            {kolonner.map((kolonne, index) => (
                <FlexDiv className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                    <Detail>
                        <strong>{kolonne.overskrift}</strong>
                    </Detail>
                    {kolonne.hjelpetekst && <HelpText>{kolonne.hjelpetekst}</HelpText>}
                </FlexDiv>
            ))}
            {verdier.map((item) =>
                kolonner.map((kolonne, index) => (
                    <BodyShortSmall className={index === 0 ? 'førsteDataKolonne' : ''} key={index}>
                        {kolonne.tekstVerdi(item) || ''}
                    </BodyShortSmall>
                ))
            )}
        </GridTabell>
    );
}

export default TabellVisning;
