import React from 'react';
import {
    IInnflyttingTilNorge,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../../../App/utils/formatter';
import { slåSammenTekst } from '../../../../App/utils/utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { innflyttingHjelpetekst } from '../../../../Felles/Personopplysninger/InnvandringUtvandring';
import { Label } from '@navikt/ds-react';
import TabellVisning, { TabellIkon } from '../../Tabell/TabellVisning';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <>
            <FlexDiv>
                <Registergrunnlag />
                <Label as={'h3'} style={{ marginLeft: '0.5rem' }}>
                    Innflytting og utflytting
                </Label>
            </FlexDiv>
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
