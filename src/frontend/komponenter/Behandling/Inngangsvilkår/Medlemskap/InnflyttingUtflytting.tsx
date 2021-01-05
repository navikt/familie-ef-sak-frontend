import React from 'react';
import { IInnflyttingTilNorge, IUtflyttingFraNorge } from '../../../../typer/personopplysninger';
import { Element } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { slåSammenTekst } from '../../../../utils/utils';
import { Tabell } from '../../TabellVisning';

interface Props {
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
}

const InnflyttingUtflytting: React.FC<Props> = ({ innflytting, utflytting }) => {
    return (
        <StyledTabell kolonner={3}>
            <Registergrunnlag />
            <Element className="tittel" tag="h3">
                Innflytting og utflytting
            </Element>
            <Tabell
                kolonneInfo={[
                    {
                        overskrift: 'Innflytting til',
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
                verdier={innflytting}
            />
            <Tabell
                kolonneInfo={[
                    {
                        overskrift: 'Utflytting fra',
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
                verdier={utflytting}
            />
        </StyledTabell>
    );
};

export default InnflyttingUtflytting;
