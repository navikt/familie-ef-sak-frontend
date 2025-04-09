import React, { useState } from 'react';
import { FagsakPerson } from '../../App/typer/fagsak';
import { HStack } from '@navikt/ds-react';
import VedtaksperioderOSBT from './Vedtaksperioder/VedtaksperioderOSBT';
import { VedtaksperioderSP } from './Vedtaksperioder/VedtaksperioderSP';
import ValgteStønaderCheckbox from './Vedtaksperioder/ValgteStønaderCheckbox';
import { utledDefaultValgtStønad, ValgtStønad } from './Vedtaksperioder/utils';

export const Vedtaksperioderoversikt: React.FC<{ fagsakPerson: FagsakPerson }> = ({
    fagsakPerson,
}) => {
    const [valgteStønader, settValgteStønader] = useState<ValgtStønad[]>(
        utledDefaultValgtStønad(fagsakPerson)
    );

    return (
        <>
            <HStack gap="8">
                <ValgteStønaderCheckbox
                    valgteStønader={valgteStønader}
                    settValgteStønader={settValgteStønader}
                />

                {fagsakPerson.overgangsstønad &&
                    valgteStønader.includes(ValgtStønad.OVERGANGSSTØNAD) && (
                        <VedtaksperioderOSBT fagsak={fagsakPerson.overgangsstønad} />
                    )}

                {fagsakPerson.barnetilsyn && valgteStønader.includes(ValgtStønad.BARNETILSYN) && (
                    <VedtaksperioderOSBT fagsak={fagsakPerson.barnetilsyn} />
                )}

                {fagsakPerson.skolepenger && valgteStønader.includes(ValgtStønad.SKOLEPENGER) && (
                    <VedtaksperioderSP fagsak={fagsakPerson.skolepenger} />
                )}
            </HStack>
        </>
    );
};
