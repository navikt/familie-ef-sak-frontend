import React from 'react';
import {
    IInnflyttingTilNorge,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../../../App/utils/formatter';
import { slåSammenTekst } from '../../../../App/utils/utils';
import { innflyttingHjelpetekst } from '../../../../Felles/Personopplysninger/InnvandringUtvandring';
import TabellVisning, { TabellIkon } from '../../Tabell/TabellVisning';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <>
            <TabellVisning
                tittel="Innflytting og utflytting"
                ikon={TabellIkon.REGISTER}
                kolonner={[
                    {
                        overskrift: 'Innflytting fra',
                        tekstVerdi: (innflytting) =>
                            slåSammenTekst(
                                innflytting.fraflyttingsland,
                                innflytting.fraflyttingssted
                            ),
                    },
                    {
                        overskrift: 'Innflyttet år',
                        hjelpetekst: innflyttingHjelpetekst,
                        tekstVerdi: (innflytting) => formaterNullableIsoÅr(innflytting.dato) || '',
                    },
                ]}
                verdier={innflytting}
            />
            <TabellVisning
                kolonner={[
                    {
                        overskrift: 'Utflytting til',
                        tekstVerdi: (utflytting) =>
                            slåSammenTekst(
                                utflytting.tilflyttingsland,
                                utflytting.tilflyttingssted
                            ),
                    },
                    {
                        overskrift: 'Utflyttingsdato',
                        tekstVerdi: (utflytting) => formaterNullableIsoDato(utflytting.dato) || '',
                    },
                ]}
                verdier={utflytting}
            />
        </>
    );
};

export default InnflyttingUtflytting;
