import React from 'react';
import {
    IInnflyttingTilNorge,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../../../App/utils/formatter';
import { slåSammenTekst } from '../../../../App/utils/utils';
import { innflyttingÅrHelpText } from '../../../../Felles/Personopplysninger/InnvandringUtvandring';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import TabellVisning from '../../Vilkårpanel/TabellVisning';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <FlexColumnContainer>
            <TabellVisning
                tittel="Innflytting og utflytting"
                ikon={VilkårInfoIkon.REGISTER}
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
                        tekstVerdi: (innflytting) => formaterNullableIsoÅr(innflytting.dato) || '',
                        helperText: innflyttingÅrHelpText,
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
        </FlexColumnContainer>
    );
};

export default InnflyttingUtflytting;
