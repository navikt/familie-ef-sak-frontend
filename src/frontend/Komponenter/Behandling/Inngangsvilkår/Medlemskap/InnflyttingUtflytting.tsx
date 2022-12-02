import React from 'react';
import {
    IInnflyttingTilNorge,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato, formaterNullableIsoÅr } from '../../../../App/utils/formatter';
import { slåSammenTekst } from '../../../../App/utils/utils';
import { Tabell } from '../NyttBarnSammePartner/Tabell';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { headerForInnflyttingTabell } from '../../../../Felles/Personopplysninger/InnvandringUtvandring';
import { Label } from '@navikt/ds-react';

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
            <Tabell
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
                        overskrift: headerForInnflyttingTabell,
                        tekstVerdi: (innflytting) => formaterNullableIsoÅr(innflytting.dato) || '',
                    },
                ]}
                data={innflytting}
            />
            <Tabell
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
                data={utflytting}
            />
        </>
    );
};

export default InnflyttingUtflytting;
