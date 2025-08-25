import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { SøkPerson } from './SøkPerson';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import { IBrevmottaker, IOrganisasjonMottaker } from './typer';
import styled from 'styled-components';
import { Ingress, Select, VStack } from '@navikt/ds-react';

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

const SøkTypeSelect = styled(Select)`
    width: 200px;
`;

export const SøkWrapper: FC<Props> = ({
    valgtePersonMottakere,
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const [søktype, settSøktype] = useState<ESøktype>();

    return (
        <VStack gap="4">
            <Ingress>Manuelt søk</Ingress>
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
                <SøkPerson
                    valgtePersonMottakere={valgtePersonMottakere}
                    settValgteMottakere={settValgtePersonMottakere}
                />
            )}
        </VStack>
    );
};
