import React from 'react';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import AdressebeskyttelseVarsel from '../../Felles/Varsel/AdressebeskyttelseVarsel';
import { formaterNullableIsoDatoTid, nullableBooleanTilTekst } from '../../App/utils/formatter';
import { UttrekkArbeidssøker } from './UttrekkArbeidssøkerSide';
import styled from 'styled-components';
import { Button, Link } from '@navikt/ds-react';
import { SmallTextLabel } from '../../Felles/Visningskomponenter/Tekster';
import { useNavigate } from 'react-router-dom';

const StyledTable = styled.table`
    width: 70%;
    padding: 2rem;
    margin-left: 1rem;
    td {
        padding: 0.75rem;
    }
`;

const UttrekkArbeidssøkerTabell: React.FC<{
    arbeidssøkere: UttrekkArbeidssøker[];
    settKontrollert: (id: string, kontrollert: boolean) => void;
}> = ({ arbeidssøkere, settKontrollert }) => {
    const navigate = useNavigate();
    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    <th>Person</th>
                    <th>Registrert som arbeidssøker i Arena</th>
                    <th>Kontrollert</th>
                </tr>
            </thead>
            <tbody>
                {arbeidssøkere.map((arbeidssøker) => {
                    return (
                        <tr key={arbeidssøker.id}>
                            <td>
                                <div style={{ display: 'flex' }}>
                                    <Link
                                        role={'link'}
                                        href={'#'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/fagsak/${arbeidssøker.fagsakId}`);
                                        }}
                                        style={{ marginRight: '1rem' }}
                                    >
                                        <SmallTextLabel>{arbeidssøker.navn}</SmallTextLabel>
                                    </Link>
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
                            <td>{nullableBooleanTilTekst(arbeidssøker.registrertArbeidssøker)}</td>
                            <td>
                                {!arbeidssøker.kontrollert ? (
                                    <Button
                                        type={'button'}
                                        variant={'secondary'}
                                        onClick={() =>
                                            settKontrollert(
                                                arbeidssøker.id,
                                                !arbeidssøker.kontrollert
                                            )
                                        }
                                    >
                                        Sett kontrollert
                                    </Button>
                                ) : (
                                    <>
                                        {formaterNullableIsoDatoTid(arbeidssøker.kontrollertTid)} (
                                        {arbeidssøker.kontrollertAv})
                                        <Button
                                            type={'button'}
                                            variant={'tertiary'}
                                            style={{ marginLeft: '1rem' }}
                                            onClick={() =>
                                                settKontrollert(
                                                    arbeidssøker.id,
                                                    !arbeidssøker.kontrollert
                                                )
                                            }
                                        >
                                            Tilbakestill
                                        </Button>
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
