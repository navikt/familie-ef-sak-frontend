import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import AdressebeskyttelseVarsel from '../../Felles/Varsel/AdressebeskyttelseVarsel';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { formaterNullableIsoDatoTid } from '../../App/utils/formatter';
import { IUttrekkArbeidssøker } from './UttrekkArbeidssøker';
import styled from 'styled-components';

const StyledTable = styled.table`
    width: 70%;
    padding: 2rem;
    margin-left: 1rem;
    td {
        padding: 0.75rem;
    }
`;

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: IUttrekkArbeidssøker[];
    settKontrollert: (id: string, kontrollert: boolean) => void;
    gåTilUrl: (url: string) => void;
}> = ({ arbeidssøkere, settKontrollert, gåTilUrl }) => {
    console.log('table');
    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    <th>Person</th>
                    <th>Kontrollert</th>
                </tr>
            </thead>
            <tbody>
                {arbeidssøkere.map((arbeidssøker) => {
                    return (
                        <tr key={arbeidssøker.id}>
                            <td>
                                <div style={{ display: 'flex' }}>
                                    <Lenke
                                        role={'link'}
                                        href={'#'}
                                        onClick={() => {
                                            gåTilUrl(`/fagsak/${arbeidssøker.fagsakId}`);
                                        }}
                                        style={{ marginRight: '1rem' }}
                                    >
                                        <Element>{arbeidssøker.navn}</Element>
                                    </Lenke>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={arbeidssøker.personIdent}
                                    />
                                    {arbeidssøker.adressebeskyttelse && (
                                        <AdressebeskyttelseVarsel
                                            adressebeskyttelse={arbeidssøker.adressebeskyttelse}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                {!arbeidssøker.kontrollert ? (
                                    <Knapp
                                        onClick={() =>
                                            settKontrollert(
                                                arbeidssøker.id,
                                                !arbeidssøker.kontrollert
                                            )
                                        }
                                    >
                                        Sett kontrollert
                                    </Knapp>
                                ) : (
                                    <>
                                        {formaterNullableIsoDatoTid(arbeidssøker.kontrollertTid)} (
                                        {arbeidssøker.kontrollertAv})
                                        <Flatknapp
                                            mini
                                            style={{ marginLeft: '1rem' }}
                                            onClick={() =>
                                                settKontrollert(
                                                    arbeidssøker.id,
                                                    !arbeidssøker.kontrollert
                                                )
                                            }
                                        >
                                            Tilbakestill
                                        </Flatknapp>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default UttrekkArbeidssøkerTabell;
