import React, { useState } from 'react';
import { FagsakPerson } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import VedtaksperioderOSBT from './Vedtaksperioder/VedtaksperioderOSBT';
import { VedtaksperioderSP } from './Vedtaksperioder/VedtaksperioderSP';
import ValgteStønaderCheckbox from './Vedtaksperioder/ValgteStønaderCheckbox';
import { harBehandling, utledDefaultValgtStønad, ValgtStønad } from './Vedtaksperioder/utils';

export const Vedtaksperioderoversikt: React.FC<{ fagsakPerson: FagsakPerson }> = ({
    fagsakPerson,
}) => {
    const defaultValgteStønader = utledDefaultValgtStønad(fagsakPerson);
    const [valgteStønader, settValgteStønader] = useState<ValgtStønad[]>(defaultValgteStønader);

    return (
        <HStack gap="8">
            <ValgteStønaderCheckbox
                valgteStønader={valgteStønader}
                settValgteStønader={settValgteStønader}
                stønaderMedBehandling={defaultValgteStønader}
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
        </HStack>
    );
};
