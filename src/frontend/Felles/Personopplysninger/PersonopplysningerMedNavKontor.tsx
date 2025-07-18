import React from 'react';
import InnflyttingUtflytting from './InnflyttingUtflytting';
import Barn from './Barn';
import Adressehistorikk from './Adressehistorikk';
import Sivilstatus from './Sivilstatus';
import Fullmakter from './Fullmakter';
import Statsborgerskap from './Statsborgerskap';
import DataViewer from '../DataViewer/DataViewer';
import Oppholdstillatelse from './Oppholdstillatelse';
import NavKontor from './NavKontor';
import { INavKontor, IPersonopplysninger } from '../../App/typer/personopplysninger';
import { Ressurs } from '../../App/typer/ressurs';
import Vergemål from './Vergemål';
import { FagsakPerson } from '../../App/typer/fagsak';
import { VStack } from '@navikt/ds-react';

export const PersonopplysningerMedNavKontor: React.FC<{
    personopplysninger: IPersonopplysninger;
    navKontor: Ressurs<INavKontor | undefined>;
    fagsakPerson: FagsakPerson;
}> = ({ personopplysninger, navKontor, fagsakPerson }) => {
    const {
        adresse,
        sivilstand,
        barn,
        statsborgerskap,
        folkeregisterpersonstatus,
        innflyttingTilNorge,
        utflyttingFraNorge,
        fullmakt,
        oppholdstillatelse,
        vergemål,
    } = personopplysninger;
    const harFagsak = !!(
        fagsakPerson.barnetilsyn ||
        fagsakPerson.skolepenger ||
        fagsakPerson.overgangsstønad
    );
    return (
        <VStack gap="space-8">
            <DataViewer response={{ navKontor }}>
                {({ navKontor }) => {
                    return <NavKontor navKontor={navKontor} />;
                }}
            </DataViewer>

            <Adressehistorikk adresser={adresse} fagsakPersonId={fagsakPerson.id} />
            <Sivilstatus sivilstander={sivilstand} harFagsak={harFagsak} />
            <Barn barn={barn} harFagsak={harFagsak} />
            <Statsborgerskap
                statsborgerskap={statsborgerskap}
                folkeregisterPersonstatus={folkeregisterpersonstatus}
            />
            <Oppholdstillatelse oppholdstillatelser={oppholdstillatelse} />
            <InnflyttingUtflytting
                innflyttinger={innflyttingTilNorge}
                utflyttinger={utflyttingFraNorge}
            />
            <Vergemål vergemål={vergemål} />
            <Fullmakter fullmakter={fullmakt} />
        </VStack>
    );
};
