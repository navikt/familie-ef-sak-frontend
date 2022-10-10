import React from 'react';
import TabellOverskrift from './TabellOverskrift';
import Hjerte from '../Ikoner/Hjerte';
import { KolonneTitler, TabellWrapper } from './TabellWrapper';
import { ISivilstand, sivilstandTilTekst } from '../../App/typer/personopplysninger';
import { KopierbartNullableFødselsnummer } from '../Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import { Normaltekst } from 'nav-frontend-typografi';
import EtikettDød from '../Etiketter/EtikettDød';
import styled from 'styled-components';
import { NavdsSemanticColorText, NavdsSemanticColorTextMuted } from '@navikt/ds-tokens/dist/tokens';

const titler = ['Status', 'Dato', 'Navn partner', 'Fødselsnummer'];
const TabellRad = styled.tr<{ gjeldende: boolean }>`
    color: ${(props) => (props.gjeldende ? NavdsSemanticColorText : NavdsSemanticColorTextMuted)};
`;

const Sivilstatus: React.FC<{ sivilstander: ISivilstand[] }> = ({ sivilstander }) => {
    return (
        <TabellWrapper>
            <TabellOverskrift Ikon={Hjerte} tittel={'Sivilstatus'} />
            <table className="tabell">
                <KolonneTitler titler={titler} />
                <tbody>
                    {sivilstander.map((sivilstand, indeks) => {
                        return (
                            <TabellRad key={indeks} gjeldende={sivilstand.erGjeldende}>
                                <td>
                                    {sivilstandTilTekst[sivilstand.type]}{' '}
                                    {sivilstand.erGjeldende ? '(gjeldende)' : ''}
                                </td>
                                <td>{formaterNullableIsoDato(sivilstand.gyldigFraOgMed)}</td>
                                <td>
                                    {sivilstand.navn}
                                    {sivilstand.dødsdato && (
                                        <EtikettDød dødsdato={sivilstand.dødsdato} />
                                    )}
                                </td>
                                <td>
                                    {sivilstand.relatertVedSivilstand ? (
                                        <KopierbartNullableFødselsnummer
                                            fødselsnummer={sivilstand.relatertVedSivilstand}
                                        />
                                    ) : (
                                        <Normaltekst>-</Normaltekst>
                                    )}
                                </td>
                            </TabellRad>
                        );
                    })}
                </tbody>
            </table>
        </TabellWrapper>
    );
};

export default Sivilstatus;
