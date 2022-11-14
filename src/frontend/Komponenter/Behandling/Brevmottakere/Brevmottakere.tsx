import BrevMottakereListe from '../Brev/BrevMottakereListe';
import { mottakereEllerBruker } from './brevmottakerUtils';
import { BrevmottakereModal } from './BrevmottakereModal';
import React, { useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { IBrevmottakere } from './typer';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';

const Brevmottakere: React.FC<{
    personopplysninger: IPersonopplysninger;
    mottakere: IBrevmottakere | undefined;
    kallSettBrevmottakere: (
        brevmottakere: IBrevmottakere
    ) => Promise<RessursSuksess<string> | RessursFeilet>;
    kanEndreBrevmottakere?: boolean;
}> = ({ personopplysninger, mottakere, kallSettBrevmottakere, kanEndreBrevmottakere = true }) => {
    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    const brevMottakere = mottakereEllerBruker(personopplysninger, mottakere);
    return (
        <>
            <BrevMottakereListe
                mottakere={brevMottakere}
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
