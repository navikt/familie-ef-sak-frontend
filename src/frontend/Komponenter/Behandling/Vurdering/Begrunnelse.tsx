import * as React from 'react';
import { FC } from 'react';
import { BegrunnelseRegel, Regel } from './typer';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { Textarea } from '@navikt/ds-react';

interface Props {
    svar: Vurdering;
    regel: Regel;
    onChange: (tekst: string) => void;
}

const Begrunnelse: FC<Props> = ({ svar, onChange, regel }) => {
    const begrunnelsetype = svar.svar && regel.svarMapping[svar.svar].begrunnelseType;
    const skjulBegrunnelse = (begrunnelsetype ?? BegrunnelseRegel.UTEN) === BegrunnelseRegel.UTEN;

    if (skjulBegrunnelse) {
        return null;
    }

    return (
        <Textarea
            label={'Begrunnelse '.concat(
                begrunnelsetype === BegrunnelseRegel.VALGFRI ? '(hvis aktuelt)' : ''
            )}
            value={svar.begrunnelse || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={0}
        />
    );
};
export default Begrunnelse;
