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

    const renderPersonhistorikkdata = () => {
        if (persondata) {
            return (
                <Ekspanderbartpanel tittel="Se json data">
                    {JSON.stringify(persondata.personhistorikkInfo)}
                </Ekspanderbartpanel>
            );
        }
    };

    const renderEkspanderbartpanel = () => {
        if (persondata) {
            return (
                <Ekspanderbartpanel tittel="Se json data">
                    {JSON.stringify(persondata)}
                </Ekspanderbartpanel>
            );
        }
    };

    return (
        <Panel>
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
            <h2>Persondata </h2>
            <p>Navn: {persondata?.personinfo.navn}</p>
            <p>Sivilstand: {persondata?.personinfo.sivilstand}</p>
            <p>Fødselsdato: {persondata?.personinfo.fødselsdato}</p>
            <p>Statsborgerskap: {persondata?.personinfo.statsborgerskap?.kode} </p>

            {renderEkspanderbartpanel()}

            <h2>Person historikk</h2>
            {renderPersonhistorikkdata()}
        </Panel>
    );
};
export default PersonInfo;
