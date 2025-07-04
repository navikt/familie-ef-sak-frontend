import React, { useState } from 'react';
import { FagsakPerson } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import VedtaksperioderOSBT from './Vedtaksperioder/VedtaksperioderOSBT';
import { VedtaksperioderSP } from './Vedtaksperioder/VedtaksperioderSP';
import ValgteStønaderCheckbox from './Vedtaksperioder/ValgteStønaderCheckbox';
import { harBehandling, utledDefaultValgtStønad, ValgtStønad } from './Vedtaksperioder/utils';
import { Infotrygdperioderoversikt } from './Vedtaksperioder/Infotrygdperioderoversikt';

export const Vedtaksperioderoversikt: React.FC<{
    fagsakPerson: FagsakPerson;
    personIdent: string;
}> = ({ fagsakPerson, personIdent }) => {
    const defaultValgteStønader = utledDefaultValgtStønad(fagsakPerson);
    const [valgteStønader, settValgteStønader] = useState<ValgtStønad[]>(defaultValgteStønader);
    const [skalViseInfotrygd, settSkalViseInfotrygd] = useState<boolean>(true);

    return (
        <HStack gap="space-16">
            <ValgteStønaderCheckbox
                valgteStønader={valgteStønader}
                settValgteStønader={settValgteStønader}
                stønaderMedBehandling={defaultValgteStønader}
                skalViseInfotrygd={skalViseInfotrygd}
                settSkalViseInfotrygd={settSkalViseInfotrygd}
            />

            {fagsakPerson.overgangsstønad &&
                harBehandling(valgteStønader, ValgtStønad.OVERGANGSSTØNAD) && (
                    <VedtaksperioderOSBT fagsak={fagsakPerson.overgangsstønad} />
                )}

            {fagsakPerson.barnetilsyn && harBehandling(valgteStønader, ValgtStønad.BARNETILSYN) && (
                <VedtaksperioderOSBT fagsak={fagsakPerson.barnetilsyn} />
            )}

            {fagsakPerson.skolepenger && harBehandling(valgteStønader, ValgtStønad.SKOLEPENGER) && (
                <VedtaksperioderSP fagsak={fagsakPerson.skolepenger} />
            )}

            {skalViseInfotrygd && (
                <Infotrygdperioderoversikt
                    fagsakPersonId={fagsakPerson.id}
                    personIdent={personIdent}
                />
            )}
        </HStack>
    );
};
