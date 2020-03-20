import React, { useEffect, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import InputMedLabelTilVenstre from '../Felleskomponenter/InputMedLabelTilVenstre/InputMedLabelTilVenstre';
import { hentPersoninfo } from '../../api/personinfo';
import { IPerson } from '../../typer/person';
import { hentInnloggetBruker } from '../../api/saksbehandler';
import { ISaksbehandler } from '../../typer/saksbehandler';
import { Panel } from 'nav-frontend-paneler';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Ressurs } from '../../typer/ressurs';
// import {Label, Input} from "nav-frontend-skjema";

const PersonInfo = () => {
    const [personinput, settPersoninput] = useState<string>('');
    const [persondata, settPersondata] = useState<IPerson>();
    const [saksbehandler, setSaksbehandler] = useState<ISaksbehandler>();

    useEffect(() => {
        return () => {
            hentInnloggetBruker().then(innhentetInnloggetSaksbehandler => {
                setSaksbehandler(innhentetInnloggetSaksbehandler);
            });
        };
    }, []);

    const renderJason = () => {
        if (persondata) {
            return (
                <>
                    <Ekspanderbartpanel tittel="Se all json data ">
                        {JSON.stringify(persondata)}
                        {JSON.stringify(persondata.personhistorikkInfo)}
                    </Ekspanderbartpanel>
                </>
            );
        }
    };

    const renderEkspanderbartpanel = () => {
        if (persondata) {
            const adresseHistorikk = persondata.personhistorikkInfo.adressehistorikk.map(
                periode => {
                    return (
                        <div key={periode.periode.fom}>
                            <p>
                                From: {periode.periode.fom}, TO: {periode.periode.tom}
                            </p>
                            <p>
                                Adr: {periode.adresse.adresselinje1}, {periode.adresse.postnummer},{' '}
                                {periode.adresse.poststed}
                            </p>
                        </div>
                    );
                }
            );

            return (
                <>
                    <Ekspanderbartpanel tittel="Se person informasjon">
                        <h2>Persondata </h2>
                        <p>Navn: {persondata?.personinfo.navn}</p>
                        <p>Personstatus: {persondata?.personinfo?.personstatus} </p>
                        <p>
                            Sivilstatus: {persondata?.personinfo.sivilstand} (* mer data fra
                            backend/søknad)
                        </p>
                        <p>Fødselsdato: {persondata?.personinfo.fødselsdato}</p>
                        <p>Statsborgerskap: {persondata?.personinfo.statsborgerskap?.kode} </p>
                        <p>Telefonnummer: (fra søknad?)</p>
                        <p>Målform: (* mangler fra backend)</p>
                        <h2>Adressehistorikk</h2>
                        {adresseHistorikk}
                    </Ekspanderbartpanel>
                </>
            );
        }
    };

    return (
        <Panel>
            <div style={{ display: 'flex' }}>
                <InputMedLabelTilVenstre
                    bredde={'S'}
                    label={'Finn person'}
                    value={personinput}
                    type={'string'}
                    onChange={(event: any) => {
                        settPersoninput(event.target.value);
                    }}
                />
                <Knapp
                    onClick={() => {
                        hentPersoninfo(personinput, saksbehandler!!).then(
                            (response: Ressurs<IPerson>) => {
                                settPersondata(response.data);
                            }
                        );
                    }}
                >
                    Finn person
                </Knapp>
            </div>
            {renderEkspanderbartpanel()}
            {renderJason()}
        </Panel>
    );
};
export default PersonInfo;
