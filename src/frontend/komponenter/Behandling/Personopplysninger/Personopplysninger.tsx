import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useHentPersonopplysninger } from '../../../hooks/useHentPersonopplysninger';
import { RessursStatus } from '../../../typer/ressurs';
import styled from 'styled-components';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import Bygning from '../../../ikoner/Bygning';

interface Props {
    id: string;
}

const TabellHeader = styled.div`
    height: 6rem;
    display: flex;
    align-items: flex-end;
`;

const BredTd = styled.td`
    width: 25%;
`;

const SpanMedVenstreMargin = styled.span`
    margin-left: 4rem;
`;

const HeaderRad: React.FC<{ titler: string[] }> = ({ titler }) => {
    return (
        <thead>
            <tr>
                {titler.map((tittel, indeks) => {
                    return (
                        <BredTd key={indeks}>
                            <Element>{tittel}</Element>
                        </BredTd>
                    );
                })}
            </tr>
        </thead>
    );
};

const FødselsnummerBarn: React.FC<{ fødelsnummer: string }> = ({ fødelsnummer }) => {
    const alder = Math.floor(
        Math.abs(
            Date.now() -
                new Date(
                    parseInt('20' + fødelsnummer.substring(4, 6)),
                    parseInt(fødelsnummer.substring(2, 4)),
                    parseInt(fødelsnummer.substring(0, 2))
                ).getTime()
        ) /
            (1000 * 3600 * 24) /
            365.25
    );
    return (
        <BredTd>
            {formatertFødselsnummer(fødelsnummer)}
            <SpanMedVenstreMargin>
                {alder < 18 ? (
                    <EtikettSuksess>
                        <EtikettLiten>{alder} år</EtikettLiten>
                    </EtikettSuksess>
                ) : (
                    <EtikettInfo>
                        <EtikettLiten>Over 18 år</EtikettLiten>
                    </EtikettInfo>
                )}
            </SpanMedVenstreMargin>
        </BredTd>
    );
};

const formatertFødselsnummer = (fødselsnummer: string) =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);

const Personopplysninger: React.FC<Props> = (props: Props) => {
    const { hentPersonopplysninger, personopplysningerResponse } = useHentPersonopplysninger();

    useEffect(() => {
        hentPersonopplysninger(props.id);
    }, [props]);

    return (
        <>
            {personopplysningerResponse.status === RessursStatus.SUKSESS && (
                <>
                    <TabellHeader>
                        <Bygning heigth={25} />
                        <Undertittel>Adresseshitorikk</Undertittel>
                    </TabellHeader>
                    <table className="tabell">
                        <HeaderRad titler={['Adresse', 'Adressetype', 'Fra', 'Til']} />
                        <tbody>
                            {personopplysningerResponse.data.adresse.map((adresse, indeks) => {
                                return (
                                    <tr key={indeks}>
                                        <td>{adresse.visningsadresse}</td>
                                        <td>{adresse.type}</td>
                                        <td>{adresse.gyldigFraOgMed}</td>
                                        <td>{adresse.gyldigTilOgMed}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <TabellHeader>
                        <Undertittel>Sivilstatus</Undertittel>
                    </TabellHeader>
                    <table className="tabell">
                        <HeaderRad titler={['Status', 'Dato', 'Navn', 'Fødselsnummer']} />
                        <tbody>
                            {personopplysningerResponse.data.sivilstand.map(
                                (sivilstand, indeks) => {
                                    return (
                                        <tr key={indeks}>
                                            <td>{sivilstand.type}</td>
                                            <td>{sivilstand.gyldigFraOgMed}</td>
                                            <td>{sivilstand.navn}</td>
                                            <td>
                                                {sivilstand.relatertVedSivilstand &&
                                                    formatertFødselsnummer(
                                                        sivilstand.relatertVedSivilstand
                                                    )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    <TabellHeader>
                        <Undertittel>Barn</Undertittel>
                    </TabellHeader>
                    <table className="tabell">
                        <HeaderRad
                            titler={['Navn', 'Fødselsnummer', 'Annen forelder', 'Bor med bruker']}
                        />
                        <tbody>
                            {personopplysningerResponse.data.barn.map((barn) => {
                                return (
                                    <tr key={barn.personIdent}>
                                        <BredTd>{barn.navn}</BredTd>
                                        <FødselsnummerBarn fødelsnummer={barn.personIdent} />
                                        <BredTd>
                                            {barn.annenForelder &&
                                                formatertFødselsnummer(
                                                    barn.annenForelder.personIdent
                                                )}
                                            {', '}
                                            {barn.annenForelder && barn.annenForelder.navn}
                                        </BredTd>
                                        <BredTd>{barn.borHosSøker ? 'Ja' : '-'}</BredTd>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <TabellHeader>
                        <Undertittel>Statsborgerskap</Undertittel>
                    </TabellHeader>
                    <table className="tabell">
                        <HeaderRad titler={['Land', 'Fra', 'Til', 'Personstatus']} />
                        <tbody>
                            {personopplysningerResponse.data.statsborgerskap.map(
                                (statsborgerskap, indeks) => {
                                    return (
                                        <tr key={indeks}>
                                            <BredTd>{statsborgerskap.land}</BredTd>
                                            <BredTd>{statsborgerskap.gyldigFraOgMedDato}</BredTd>
                                            <BredTd>{statsborgerskap.gyldigTilOgMedDato}</BredTd>
                                            <BredTd>
                                                {statsborgerskap.land.toLowerCase() === 'norge' &&
                                                    personopplysningerResponse.data
                                                        .folkeregisterpersonstatus}
                                            </BredTd>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>

                    <TabellHeader>
                        <Undertittel>Innvandring og utvandring</Undertittel>
                    </TabellHeader>
                    <table className="tabell">
                        <HeaderRad titler={['Innvandret fra', 'Dato', '', '']} />
                        <tbody>
                            {personopplysningerResponse.data.innflyttingTilNorge.map(
                                (innflytting, indeks) => {
                                    return (
                                        <tr key={indeks}>
                                            <BredTd>{innflytting.fraflyttingsland}</BredTd>
                                            <BredTd>
                                                {
                                                    innflytting.folkeregistermetadata
                                                        .gyldighetstidspunkt
                                                }
                                            </BredTd>
                                            <BredTd />
                                            <BredTd />
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                    <table className="tabell">
                        <HeaderRad titler={['Utvandret til', 'Dato', '', '']} />
                        <tbody>
                            {personopplysningerResponse.data.utflyttingFraNorge.map(
                                (utflytting, indeks) => {
                                    return (
                                        <tr key={indeks}>
                                            <BredTd>{utflytting.tilflyttingsland}</BredTd>
                                            <BredTd>
                                                {
                                                    utflytting.folkeregistermetadata
                                                        .gyldighetstidspunkt
                                                }
                                            </BredTd>
                                            <BredTd />
                                            <BredTd />
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>

                    <TabellHeader>
                        <Undertittel>Fullmakter</Undertittel>
                    </TabellHeader>
                    {(personopplysningerResponse.data.fullmakt[0] && (
                        <table className="tabell">
                            <HeaderRad titler={['Fullmektig', 'Fødselsnummer', 'Fra', 'Til']} />
                            <tbody>
                                {personopplysningerResponse.data.fullmakt.map(
                                    (fullmakt, indeks) => {
                                        return (
                                            <tr key={indeks}>
                                                <BredTd>{fullmakt.navn}</BredTd>
                                                <BredTd>{fullmakt.motpartsPersonident}</BredTd>
                                                <BredTd>{fullmakt.gyldigFraOgMed}</BredTd>
                                                <BredTd>{fullmakt.gyldigFraOgMed}</BredTd>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    )) || <Normaltekst>Ingen data</Normaltekst>}
                </>
            )}
        </>
    );
};

export default Personopplysninger;
