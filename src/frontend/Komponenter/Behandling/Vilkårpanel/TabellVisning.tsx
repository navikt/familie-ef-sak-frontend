import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';
import { Detail, HelpText, Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { GridTabell } from './GridTabell';

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
}

export interface Kolonnedata<T> {
    ikon?: TabellIkon;
    tittel?: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
    ikonVisning?: boolean;
}

export interface Kolonner<T> {
    overskrift: string;
    helperText?: string;
    tekstVerdi: (data: T) => React.ReactNode;
}

export const mapIkon = (ikon: TabellIkon) => {
    switch (ikon) {
        case TabellIkon.REGISTER:
            return <Registergrunnlag />;
        case TabellIkon.SØKNAD:
            return <Søknadsgrunnlag />;
        case TabellIkon.KALKULATOR:
            return <Calculator />;
    }
};

const FlexDiv = styled.div`
    display: flex;
    gap: 1rem;
`;

function TabellVisning<T>(props: Kolonnedata<T>): React.ReactElement<Kolonnedata<T>> {
    const { ikon, tittel, verdier, kolonner, ikonVisning = true } = props;
    return (
        <GridTabell kolonner={kolonner.length + 1} ikonVisning={ikonVisning}>
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
                    {kolonne.helperText && <HelpText>{kolonne.helperText}</HelpText>}
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
