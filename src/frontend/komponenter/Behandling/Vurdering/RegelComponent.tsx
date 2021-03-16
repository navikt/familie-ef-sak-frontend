import * as React from 'react';
import { FC } from 'react';
import { Radio, RadioGruppe, Textarea as TextareaNav } from 'nav-frontend-skjema';
import { BegrunnelseRegel, Regel, VilkårSvar } from './typer';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';

const Textarea = hiddenIf(TextareaNav);

interface Props {
    regel: Regel;
    svar: VilkårSvar;
    oppdaterSvar: () => void;
    opppdaterBegrunnelse: (e: any) => void;
}

export const RegelComponent: FC<Props> = ({ regel, svar, oppdaterSvar, opppdaterBegrunnelse }) => {
    const { begrunnelse } = regel.svarMapping[svar.svarId];
    return (
        <div>
            <div>{regel.regelId}</div>
            <RadioGruppe>
                {Object.keys(regel.svarMapping).map((svarId) => (
                    <Radio
                        key={`${regel.regelId}_${svarId}`}
                        label={svarId}
                        name={`${regel.regelId}_${svarId}`}
                        value={svarId}
                        checked={svarId === svar.svarId}
                        onChange={oppdaterSvar}
                    />
                ))}
            </RadioGruppe>
            <Textarea
                label={`Begrunnelse: ${begrunnelse}`}
                maxLength={0}
                hidden={begrunnelse === BegrunnelseRegel.UTEN}
                placeholder="Skriv inn tekst"
                value={svar.begrunnelse || ''}
                onChange={opppdaterBegrunnelse}
            />
        </div>
    );
};
