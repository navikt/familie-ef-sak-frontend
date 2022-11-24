import BrevMottakereListe from '../Brev/BrevMottakereListe';
import { mottakereEllerBruker } from './brevmottakerUtils';
import { BrevmottakereModal } from './BrevmottakereModal';
import React, { useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { IBrevmottakere } from './typer';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { IOrganisasjon } from './SøkOrganisasjon';
import { useApp } from '../../../App/context/AppContext';

const Brevmottakere: React.FC<{
    personopplysninger: IPersonopplysninger;
    mottakere: IBrevmottakere | undefined;
    kallSettBrevmottakere: (
        brevmottakere: IBrevmottakere
    ) => Promise<RessursSuksess<string> | RessursFeilet>;
    kanEndreBrevmottakere?: boolean;
}> = ({ personopplysninger, mottakere, kallSettBrevmottakere, kanEndreBrevmottakere = true }) => {
    const { axiosRequest } = useApp();
    const [organisasjoner, settOrganisasjoner] = useState<IOrganisasjon[]>([]);
    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    const brevMottakere = mottakereEllerBruker(personopplysninger, mottakere);

    useEffect(() => {
        if (mottakere && mottakere.organisasjoner.length > 0) {
            mottakere.organisasjoner.forEach((oraganisasjon) => {
                axiosRequest<IOrganisasjon, null>({
                    method: 'GET',
                    url: `familie-ef-sak/api/organisasjon/${oraganisasjon.organisasjonsnummer}`,
                }).then((response: RessursSuksess<IOrganisasjon> | RessursFeilet) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        settOrganisasjoner((prevState) => [...prevState, response.data]);
                    }
                });
            });
        }
    }, [mottakere, axiosRequest, settOrganisasjoner]);
    return (
        <>
            <BrevMottakereListe
                mottakere={brevMottakere}
                organisasjoner={organisasjoner}
                kanEndreBrevmottakere={kanEndreBrevmottakere}
                settVisBrevmottakereModal={settVisBrevmottakereModal}
            />
            {visBrevmottakereModal && (
                <BrevmottakereModal
                    personopplysninger={personopplysninger}
                    mottakere={brevMottakere}
                    kallSettBrevmottakere={kallSettBrevmottakere}
                    settVisBrevmottakereModal={settVisBrevmottakereModal}
                />
            )}
        </>
    );
};

export default Brevmottakere;
