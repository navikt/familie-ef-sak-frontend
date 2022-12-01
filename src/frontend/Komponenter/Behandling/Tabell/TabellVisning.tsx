import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Calculator } from '@navikt/ds-icons';
import { Heading, Label } from '@navikt/ds-react';
import {
    BodyShortSmall,
    DetailSmall,
    LabelSmallAsText,
} from '../../../Felles/Visningskomponenter/Tekster';

export enum TabellIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
}

export interface Kolonndata<T> {
    ikon?: TabellIkon;
    tittel: string;
    undertittel?: string;
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
    const { ikon, tittel, undertittel, tittelType, verdier, kolonner } = props;
    return (
        <GridTabell kolonner={kolonner.length + 1} utenIkon={!ikon}>
            {ikon && mapIkon(ikon)}
            {tittelType === 'undertittel' ? (
                <Heading size="small" className="tittel" level={'3'}>
                    {tittel}
                </Heading>
            ) : (
                <Label className="tittel" as="h3" size={'small'}>
                    {' '}
                    {tittel}
                    {undertittel && (
                        <DetailSmall style={{ marginLeft: '0.25rem' }}>{undertittel}</DetailSmall>
                    )}
                </Label>
            )}

            <>
                {kolonner.map((kolonne, index) => (
                    <LabelSmallAsText
                        className={index === 0 ? 'førsteDataKolonne' : ''}
                        key={index}
                    >
                        {kolonne.overskrift}
                    </LabelSmallAsText>
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
