import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { UtdanningsformTilTekst } from '../Aktivitet/typer';
import styled from 'styled-components';
import { utledVisningForStudiebelastning } from '../../Inngangsvilkår/utils';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const UtgiftContainer = styled.div<{ kolonneBredde: string }>`
    display: grid;
    grid-template-columns: ${(props) => props.kolonneBredde};
`;

const HøyrestiltTekst = styled(BodyShortSmall)`
    display: flex;
    justify-content: right;
`;

const utledKolonnebredde = (utgifter: number[]): string => {
    const høyesteUtgift = Math.max(...utgifter);
    if (høyesteUtgift >= 100000) {
        return '4rem';
    } else if (høyesteUtgift >= 10000) {
        return '3.5rem';
    } else if (høyesteUtgift >= 1000) {
        return '3rem';
    }
    return '2.3rem';
};

const søknadsutgifterTilListe = (
    semesteravgift?: number,
    studieavgift?: number,
    eksamensgebyr?: number
): number[] => {
    return Array.of(
        semesteravgift ? semesteravgift : 0,
        studieavgift ? studieavgift : 0,
        eksamensgebyr ? eksamensgebyr : 0
    );
};

const Dokumentasjonsvisning: FC<Props> = ({ aktivitet }) => {
    const { underUtdanning } = aktivitet;

    const søknadsutgifter = søknadsutgifterTilListe(
        underUtdanning?.semesteravgift,
        underUtdanning?.studieavgift,
        underUtdanning?.eksamensgebyr
    );

    const kolonnebredde = utledKolonnebredde(søknadsutgifter);

    return (
        <>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Skole/utdanningssted</BodyShortSmall>
                <BodyShortSmall>{underUtdanning?.skoleUtdanningssted}</BodyShortSmall>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Linje/kurs/grad</BodyShortSmall>
                <BodyShortSmall>{underUtdanning?.linjeKursGrad}</BodyShortSmall>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Utdanningstype</BodyShortSmall>
                {underUtdanning?.offentligEllerPrivat && (
                    <BodyShortSmall>
                        {UtdanningsformTilTekst[underUtdanning?.offentligEllerPrivat]}
                    </BodyShortSmall>
                )}
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Studieperiode</BodyShortSmall>
                <BodyShortSmall>{`${formaterNullableIsoDato(
                    underUtdanning?.fra
                )} -  ${formaterNullableIsoDato(underUtdanning?.til)}`}</BodyShortSmall>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Studiebelastning</BodyShortSmall>
                <BodyShortSmall>{utledVisningForStudiebelastning(underUtdanning)}</BodyShortSmall>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Semesteravgift</BodyShortSmall>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        {utledUtgiftsbeløp(underUtdanning?.semesteravgift)}
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Studieavgift</BodyShortSmall>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        {utledUtgiftsbeløp(underUtdanning?.studieavgift)}
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
            <>
                <Søknadsgrunnlag />
                <BodyShortSmall>Eksamensgebyr</BodyShortSmall>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        {utledUtgiftsbeløp(underUtdanning?.eksamensgebyr)}
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
        </>
    );
};

export default Dokumentasjonsvisning;
