import * as React from 'react';
import { FC } from 'react';
import { Radio, RadioGruppe, Textarea as TextareaNav } from 'nav-frontend-skjema';
import {BegrunnelseRegel, Regel, SvarId, Vilkårsvar} from './typer';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';

const Textarea = hiddenIf(TextareaNav);

interface Props {
    regel: Regel;
    svar: Vilkårsvar;
    oppdaterSvar: (svar: SvarId) => void;
    opppdaterBegrunnelse: (begrunnelse: string) => void;
};



export const RegelComponent: FC<Props> = ({ regel, svar, oppdaterSvar, opppdaterBegrunnelse }) => {
    const begrunnelse =
        (svar.svarId && regel.svarMapping[svar.svarId].begrunnelse) ?? BegrunnelseRegel.UTEN;

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
                        onChange={() => oppdaterSvar(svarId)}
                    />
                ))}
            </RadioGruppe>
            <Textarea
                label={`Begrunnelse: ${begrunnelse}`}
                maxLength={0}
                hidden={begrunnelse === BegrunnelseRegel.UTEN}
                placeholder="Skriv inn tekst"
                value={svar.begrunnelse || ''}
                onChange={(e) => opppdaterBegrunnelse(e.target.value)}
            />
        </div>
    );
};
