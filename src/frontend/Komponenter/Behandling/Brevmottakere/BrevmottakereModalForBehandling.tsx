import React, { FC } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { IBrevmottakere } from './typer';
import { BrevmottakereModal } from './BrevmottakereModal';

export const BrevmottakereModalForBehandling: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ personopplysninger, behandlingId }) => {
    const { axiosRequest } = useApp();
    const settBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'POST',
            data: brevmottakere,
        });

    const hentBrevmottakere = () =>
        axiosRequest<IBrevmottakere | undefined, null>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'GET',
        });
    return (
        <BrevmottakereModal
            personopplysninger={personopplysninger}
            kallSettBrevmottakere={settBrevmottakere}
            kallHentBrevmottakere={hentBrevmottakere}
        />
    );
};
