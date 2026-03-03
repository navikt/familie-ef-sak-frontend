import React, { ReactNode } from 'react';

import styled from 'styled-components';
import { adressebeskyttelsestyper } from '@navikt/familie-typer';

import { inputId } from '.';
import { ISøkeresultat } from '..';
import { formaterPersonIdent } from './formatter';
import { StyledAlertStripe } from './Søkeresultater';
import { BodyShort } from '@navikt/ds-react';

interface Props {
    formaterResultat?: (
        søkeresultat: ISøkeresultat,
        erSøkeresultatValgt: boolean
    ) => React.ReactNode;
    søkeresultatOnClick: (søkResultat: ISøkeresultat) => void;
    søkeresultater: ISøkeresultat[];
    valgtSøkeresultat: number;
    settValgtSøkeresultat: (søkeresultatIndex: number) => void;
    ingenFagsakKomponent?: ReactNode;
}

const ResultatListe = styled.ul`
    width: 20rem;
    padding: 0;
    margin: 0;
`;

const ResultatListeElement = styled.li<{ $fokus: boolean }>`
    list-style-type: none;
    padding: 0.5rem;
    outline: ${({ $fokus }) => ($fokus ? `3px solid var(--a-orange-300)` : '')};
    border-radius: 8px;

    &:hover {
        background-color: var(--a-gray-100);
        cursor: pointer;
    }
`;

const ResultatIkonOgRolle = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
    align-items: center;
    min-width: 3.5rem;
    font-size: var(--a-font-size-small);

    svg {
        text-align: center;
    }
`;

const ResultatListeElementKnapp = styled.div`
    display: flex;
    flex-direction: row;
`;

const Søkeresultat: React.FC<Props> = ({
    formaterResultat,
    settValgtSøkeresultat,
    søkeresultatOnClick,
    søkeresultater,
    valgtSøkeresultat,
    ingenFagsakKomponent,
}) => {
    return søkeresultater.length > 0 ? (
        <ResultatListe aria-labelledby={inputId}>
            {søkeresultater.map((søkeresultat: ISøkeresultat, index: number) => {
                if (formaterResultat) {
                    return formaterResultat(søkeresultat, index === valgtSøkeresultat);
                } else {
                    return (
                        <ResultatListeElement key={index} $fokus={index === valgtSøkeresultat}>
                            <ResultatListeElementKnapp
                                aria-label={
                                    søkeresultat.harTilgang
                                        ? søkeresultat.navn
                                        : 'Person har diskresjonskode'
                                }
                                aria-selected={index === valgtSøkeresultat}
                                role={'option'}
                                onClick={() => {
                                    søkeresultatOnClick(søkeresultat);
                                    settValgtSøkeresultat(index);
                                }}
                            >
                                <ResultatIkonOgRolle>
                                    {søkeresultat.ikon}
                                    {søkeresultat.rolle ? søkeresultat.rolle : ''}
                                </ResultatIkonOgRolle>
                                <div>
                                    <BodyShort size={'small'}>
                                        {søkeresultat.harTilgang
                                            ? `${søkeresultat.navn} (${formaterPersonIdent(
                                                  søkeresultat.ident
                                              )})`
                                            : `Personen har diskresjonskode ${
                                                  søkeresultat.adressebeskyttelseGradering
                                                      ? adressebeskyttelsestyper[
                                                            søkeresultat.adressebeskyttelseGradering
                                                        ]
                                                      : 'ukjent'
                                              }`}
                                    </BodyShort>

                                    {!søkeresultat.fagsakId && søkeresultat.harTilgang && (
                                        <ResultatVisningUtenFagsak
                                            ingenFagsakKomponent={ingenFagsakKomponent}
                                        />
                                    )}
                                </div>
                            </ResultatListeElementKnapp>
                        </ResultatListeElement>
                    );
                }
            })}
        </ResultatListe>
    ) : (
        <StyledAlertStripe variant={'info'}>Beklager, ingen treff</StyledAlertStripe>
    );
};

const ResultatVisningUtenFagsak: React.FC<{ ingenFagsakKomponent?: ReactNode }> = ({
    ingenFagsakKomponent,
}) => {
    if (ingenFagsakKomponent) {
        return <>ingenFagsakKomponent</>;
    }

    return <BodyShort size={'small'}>{`Ingen fagsak. Trykk for å opprette.`}</BodyShort>;
};

export default Søkeresultat;
