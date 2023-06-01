import * as React from 'react';
import { Detail, HelpText, Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { mapIkon, VilkårInfoIkon } from '../Vilkårpanel/VilkårInformasjonKomponenter';
export interface Kolonnedata<T> {
    ikon?: VilkårInfoIkon;
    tittel?: string;
    verdier: T[];
    kolonner: Kolonner<T>[];
    ikonVisning?: boolean;
    minimerKolonnebredde?: boolean;
}

export interface Kolonner<T> {
    overskrift: string;
    helperText?: string;
    tekstVerdi: (data: T) => React.ReactNode;
}

const breddeKolonner = (antallKolonner: number) => {
    if (antallKolonner === 4) {
        return '150px';
    } else if (antallKolonner === 5) {
        return 'auto';
    } else {
        return '325px';
    }
};

const GridTabell = styled.div<{
    kolonner: number;
    ikonVisning: boolean;
    minimerKolonnebredde: boolean;
}>`
    display: grid;
    grid-template-columns:
        ${(props) => props.ikonVisning && '21px'}
        ${(props) =>
            props.minimerKolonnebredde
                ? `repeat(${props.kolonner - 1}, minmax(max-content, 7rem))`
                : `min(200px, 250px) repeat(${props.kolonner - 1}, ${breddeKolonner(
                      props.kolonner
                  )})`};
    grid-gap: 0.5rem;

    .tittel {
        padding-bottom: 0.25rem;
        grid-column: ${(props) => (props.ikonVisning ? 2 : 1)} / ${(props) => props.kolonner + 1};

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

function TabellVisning<T>(props: Kolonnedata<T>): React.ReactElement<Kolonnedata<T>> {
    const {
        ikon,
        tittel,
        verdier,
        kolonner,
        ikonVisning = true,
        minimerKolonnebredde = false,
    } = props;
    return (
        <GridTabell
            kolonner={kolonner.length + 1}
            ikonVisning={ikonVisning}
            minimerKolonnebredde={minimerKolonnebredde}
        >
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
