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
    kallHentBrevmottakere: () => Promise<
        RessursSuksess<IBrevmottakere | undefined> | RessursFeilet
    >;
    kanEndreBrevmottakere?: boolean;
}> = ({
    personopplysninger,
    mottakere,
    kallSettBrevmottakere,
    kallHentBrevmottakere,
    kanEndreBrevmottakere = true,
}) => {
    const [visBrevmottakereModal, settVisBrevmottakereModal] = useState(false);

    return (
        <>
            <BrevMottakereListe
                mottakere={mottakereEllerBruker(personopplysninger, mottakere)}
                kanEndreBrevmottakere={kanEndreBrevmottakere}
                settVisBrevmottakereModal={settVisBrevmottakereModal}
            />
            <BrevmottakereModal
                personopplysninger={personopplysninger}
                kallSettBrevmottakere={kallSettBrevmottakere}
                kallHentBrevmottakere={kallHentBrevmottakere}
                visBrevmottakereModal={visBrevmottakereModal}
                settVisBrevmottakereModal={settVisBrevmottakereModal}
            />
        </>
    );
};

export default Brevmottakere;
