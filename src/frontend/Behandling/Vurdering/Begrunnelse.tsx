import * as React from 'react';
import { FC } from 'react';
import { Textarea as TextareaNav } from 'nav-frontend-skjema';
import { BegrunnelseRegel, Regel } from './typer';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import hiddenIf from '../../Felles/HiddenIf/hiddenIf';

const Textarea = hiddenIf(TextareaNav);

interface Props {
    svar: Vurdering;
    regel: Regel;
    onChange: (tekst: string) => void;
}

const Begrunnelse: FC<Props> = ({ svar, onChange, regel }) => {
    const begrunnelsetype = svar.svar && regel.svarMapping[svar.svar].begrunnelseType;
    const skjulBegrunnelse = (begrunnelsetype ?? BegrunnelseRegel.UTEN) === BegrunnelseRegel.UTEN;

    return (
        <Textarea
            label={'Begrunnelse '.concat(
                begrunnelsetype === BegrunnelseRegel.VALGFRI ? '(hvis aktuelt)' : ''
            )}
            value={svar.begrunnelse || ''}
            onChange={(e) => onChange(e.target.value)}
            hidden={skjulBegrunnelse}
            maxLength={0}
        />
    );
};
export default Begrunnelse;
