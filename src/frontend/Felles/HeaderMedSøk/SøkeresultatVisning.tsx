import React from 'react';
import styled from 'styled-components';
import { ISøkeresultat } from '@navikt/familie-header';
import { BodyShort, HStack } from '@navikt/ds-react';
import { formaterPersonIdent } from '@navikt/familie-header/dist/søk/formatter';
import { AlertWarning } from '../Visningskomponenter/Alerts';
import { adressebeskyttelsestyper } from './utils';
import { AFontSizeSmall, AGray100, AOrange300 } from '@navikt/ds-tokens/dist/tokens';

const ResultatElement = styled.div<{ $fokus: boolean }>`
    list-style-type: none;
    padding: 0.5rem;
    outline: ${({ $fokus }) => ($fokus ? `3px solid ${AOrange300}` : '')};
    border-radius: 8px;

    &:hover {
        background-color: ${AGray100};
        cursor: pointer;
    }
`;

const ResultatIkonOgRolle = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
    align-items: center;
    min-width: 3.5rem;
    font-size: ${AFontSizeSmall};

    svg {
        text-align: center;
    }
`;

const ResultatElementKnapp = styled.li``;

export const utledSøkeresultatVisning = (
    søkeresultat: ISøkeresultat,
    _erSøkeresultatValgt: boolean,
    søkeresultatOnClick: (søkResultat: ISøkeresultat) => void,
    fokuserSøkeresultat: boolean
) => {
    return (
        <ResultatElement $fokus={fokuserSøkeresultat}>
            <ResultatElementKnapp
                aria-label={
                    søkeresultat.harTilgang ? søkeresultat.navn : 'Person har diskresjonskode'
                }
                role={'option'}
                onClick={() => søkeresultatOnClick(søkeresultat)}
            >
                <ResultatElementKort søkeresultat={søkeresultat} />
            </ResultatElementKnapp>
        </ResultatElement>
    );
};

const ResultatElementKort: React.FC<{ søkeresultat: ISøkeresultat }> = ({ søkeresultat }) => {
    if (!søkeresultat.fagsakId && søkeresultat.harTilgang) {
        return (
            <AlertWarning size="small">
                <BodyShort size="small" spacing>
                    Personen har ingen saker i EF Sak.
                </BodyShort>
                <BodyShort weight="semibold" size="small">
                    Trykk for å opprette person.
                </BodyShort>
            </AlertWarning>
        );
    }

    return (
        <HStack wrap={false}>
            <ResultatIkonOgRolle>
                {søkeresultat.ikon}
                {søkeresultat.rolle ? søkeresultat.rolle : ''}
            </ResultatIkonOgRolle>
            <BodyShort size={'small'}>
                {søkeresultat.harTilgang
                    ? `${søkeresultat.navn} (${formaterPersonIdent(søkeresultat.ident)})`
                    : `Personen har diskresjonskode ${
                          søkeresultat.adressebeskyttelseGradering
                              ? adressebeskyttelsestyper[søkeresultat.adressebeskyttelseGradering]
                              : 'ukjent'
                      }`}
            </BodyShort>
        </HStack>
    );
};
