import React, { FC } from 'react';
import { ISelvstendig } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const SelvstendigNæringsdrivendeEllerFrilanser: FC<{
    firma: ISelvstendig;
    stønadstype: Stønadstype;
}> = ({ firma, stønadstype }) => {
    return (
        <InfoSeksjonWrapper
            undertittel={
                ArbeidssituasjonTilTekst[
                    EArbeidssituasjon.erSelvstendigNæringsdriveneEllerFrilanser
                ]
            }
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer $gap={0.75}>
                <Informasjonsrad label="Firma" verdi={firma.firmanavn} />
                <Informasjonsrad label="Organisasjonsnummer" verdi={firma.organisasjonsnummer} />
                <Informasjonsrad
                    label="Etableringsdato"
                    verdi={formaterNullableIsoDato(firma.etableringsdato)}
                />
                {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                    <Informasjonsrad label="Stillingsprosent" verdi={firma.arbeidsmengde + ' %'} />
                )}
                {(stønadstype === Stønadstype.OVERGANGSSTØNAD ||
                    stønadstype === Stønadstype.BARNETILSYN) && (
                    <Informasjonsrad
                        label="Beskrivelse av arbeidsuke"
                        verdi={firma.hvordanSerArbeidsukenUt}
                    />
                )}
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};

export default SelvstendigNæringsdrivendeEllerFrilanser;
