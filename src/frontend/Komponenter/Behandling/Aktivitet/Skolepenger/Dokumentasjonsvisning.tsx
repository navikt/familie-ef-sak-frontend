import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { IAktivitet, IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { EStudieandel, StudieandelTilTekst, UtdanningsformTilTekst } from '../Aktivitet/typer';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const Dokumentasjonsvisning: FC<Props> = ({ aktivitet }) => {
    const { underUtdanning } = aktivitet;

    const utledVisningForStudiebelastning = (utdanning?: IUnderUtdanning): string => {
        if (utdanning) {
            return utdanning.heltidEllerDeltid === EStudieandel.heltid
                ? StudieandelTilTekst[utdanning.heltidEllerDeltid]
                : `${utdanning.heltidEllerDeltid} - ${utdanning.hvorMyeSkalDuStudere}%`;
        }
        return 'Ikke oppgitt av bruker';
    };

    return (
        <>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Skole/utdanningssted</Normaltekst>
                <Normaltekst>{underUtdanning?.skoleUtdanningssted}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Linje/kurs/grad</Normaltekst>
                <Normaltekst>{underUtdanning?.linjeKursGrad}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Utdanningstype</Normaltekst>
                {underUtdanning?.offentligEllerPrivat && (
                    <Normaltekst>
                        {UtdanningsformTilTekst[underUtdanning?.offentligEllerPrivat]}
                    </Normaltekst>
                )}
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Studieperiode</Normaltekst>
                <Normaltekst>{`${formaterNullableIsoDato(
                    underUtdanning?.fra
                )} -  ${formaterNullableIsoDato(underUtdanning?.til)}`}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Studiebelastning</Normaltekst>
                <Normaltekst>{utledVisningForStudiebelastning(underUtdanning)}</Normaltekst>
            </>
        </>
    );
};

export default Dokumentasjonsvisning;
