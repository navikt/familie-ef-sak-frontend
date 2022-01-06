import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import { Select } from 'nav-frontend-skjema';
import { SøkPerson } from './SøkPerson';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';

interface Props {
    valgtePersonMottakere: IBrevmottaker[];
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

enum ESøktype {
    ORGANISASJON = 'ORGANISASJON',
    PERSON = 'PERSON',
}

export const SøkWrapper: FC<Props> = ({
    valgtePersonMottakere,
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const [søktype, settSøktype] = useState<ESøktype>();

    return (
        <>
            <Ingress>Manuelt søk</Ingress>
            <Select value={søktype} onChange={(e) => settSøktype(e.target.value as ESøktype)}>
                <option>Velg</option>
                <option value={ESøktype.ORGANISASJON}>Organisasjon</option>
                <option value={ESøktype.PERSON}>Person</option>
            </Select>
            {søktype === ESøktype.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === ESøktype.PERSON && (
                <SøkPerson
                    valgteMottakere={valgtePersonMottakere}
                    settValgteMottakere={settValgtePersonMottakere}
                />
            )}
        </>
    );
};
