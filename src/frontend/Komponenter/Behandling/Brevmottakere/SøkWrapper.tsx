import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { SøkPerson } from './SøkPerson';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import styled from 'styled-components';
import { Ingress, Select } from '@navikt/ds-react';

interface Props {
    settValgtePersonMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    valgteOrganisasjonMottakere: IOrganisasjonMottaker[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<IOrganisasjonMottaker[]>>;
}

enum ESøktype {
    ORGANISASJON = 'ORGANISASJON',
    PERSON = 'PERSON',
}

const Underoverskrift = styled(Ingress)`
    margin-bottom: 1rem;
`;

const SøkTypeSelect = styled(Select)`
    width: 200px;
    margin-bottom: 1rem;
`;

export const SøkWrapper: FC<Props> = ({
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const [søktype, settSøktype] = useState<ESøktype>();

    return (
        <>
            <Underoverskrift>Manuelt søk</Underoverskrift>
            <SøkTypeSelect
                label={'Manuelt søk'}
                hideLabel
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as ESøktype)}
            >
                <option>Velg</option>
                <option value={ESøktype.ORGANISASJON}>Organisasjon</option>
                <option value={ESøktype.PERSON}>Person</option>
            </SøkTypeSelect>
            {søktype === ESøktype.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === ESøktype.PERSON && (
                <SøkPerson settValgteMottakere={settValgtePersonMottakere} />
            )}
        </>
    );
};
