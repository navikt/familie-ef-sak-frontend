import React, { useEffect, useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { hentPersoninfo } from '../../api/personinfo';
import { IPerson } from '../../typer/person';
import { hentInnloggetBruker } from '../../api/saksbehandler';
import { ISaksbehandler } from '../../typer/saksbehandler';
import PanelBase from 'nav-frontend-paneler';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { Input } from 'nav-frontend-skjema';
import classNames from 'classnames';

const PersonInfo = () => {
    const [personinput, settPersoninput] = useState<string>('');
    const [persondata, settPersondata] = useState<IPerson | undefined>();
    const [saksbehandler, setSaksbehandler] = useState<ISaksbehandler>();
    const [melding, settMelding] = useState<string>('');

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
                    <p>Navn: {persondata?.personinfo.navn}</p>
                    <Ekspanderbartpanel tittel="Se person informasjon">
                        <h2>Persondata </h2>
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
        <div className={'personinfo'}>
            <PanelBase>
                <div className={'personinfo__inputogknapp'}>
                    <Input
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            settPersoninput(event.target.value);
                        }}
                        value={personinput}
                        id={'person-info'}
                        label={'Ident'}
                        bredde={'XL'}
                        placeholder={'fnr/dnr'}
                        feil={melding}
                    />
                    <Knapp
                        onClick={() => {
                            settPersondata(undefined);
                            hentPersoninfo(personinput, saksbehandler!!).then(
                                (response: Ressurs<IPerson>) => {
                                    if (response.status === RessursStatus.SUKSESS) {
                                        settPersondata(response.data);
                                    } else if (response.status === RessursStatus.FEILET) {
                                        settMelding(response.melding);
                                    }
                                }
                            );
                        }}
                        children={'Hent'}
                    />
                </div>
            </PanelBase>
            <PanelBase className={classNames('personinfo__panel', 'panel--gra')}>
                {renderEkspanderbartpanel()}
                {renderJason()}
            </PanelBase>
        </div>
    );
};
export default PersonInfo;
