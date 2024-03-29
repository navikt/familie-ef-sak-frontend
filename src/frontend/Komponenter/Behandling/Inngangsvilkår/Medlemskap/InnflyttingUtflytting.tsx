import React from 'react';
import {
    IInnflyttingTilNorge,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../../../App/utils/formatter';
import { slåSammenTekst } from '../../../../App/utils/utils';
import TabellVisning from '../../Tabell/TabellVisning';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <FlexColumnContainer $gap={1}>
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
                        helperText:
                            'Innflyttet år er basert på Folkeregisteret sitt gyldighetstidspunktet for innflytting. Denne har nødvendigvis ikke noen sammenheng med når innflyttingen skjedde i virkeligheten. Dersom man skal finne ut når en innflytting gjelder fra må man se på andre opplysninger, f.eks. den norske bostedsadressens fra-dato.',
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
