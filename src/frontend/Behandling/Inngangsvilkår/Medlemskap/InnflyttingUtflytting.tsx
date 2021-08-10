import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../App/typer/personopplysninger';
import { Element } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { slåSammenTekst } from '../../../App/utils/utils';
import { Tabell } from '../NyttBarnSammePartner/Tabell';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <>
            <FlexDiv>
                <Registergrunnlag />
                <Element className="tittel" tag="h3" style={{ marginLeft: '0.5rem' }}>
                    Innflytting og utflytting
                </Element>
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
                        overskrift: 'Dato',
                        tekstVerdi: (innflytting) =>
                            formaterNullableIsoDato(innflytting.dato) || '',
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
                        overskrift: 'Dato',
                        tekstVerdi: (utflytting) => formaterNullableIsoDato(utflytting.dato) || '',
                    },
                ]}
                data={utflytting}
            />
        </>
    );
};

export default InnflyttingUtflytting;
