import { Regel } from './typer';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { svarTypeTilTekst } from './tekster';
import { Radio } from '@navikt/ds-react';
import * as React from 'react';

interface Props {
    regel: Regel;
    settVurdering: (nyttSvar: Vurdering) => void;
}

export const RadioKnapper: React.FC<Props> = ({ regel, settVurdering }) => (
    <>
        {Object.keys(regel.svarMapping).map((svarId) => (
            <Radio
                key={`${regel.regelId}_${svarId}`}
                name={`${regel.regelId}_${svarId}`}
                value={svarId}
                onChange={() =>
                    settVurdering({
                        svar: svarId,
                        regelId: regel.regelId,
                    })
                }
            >
                {svarTypeTilTekst[svarId]}
            </Radio>
        ))}
    </>
);
