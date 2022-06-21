import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato, utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { IAktivitet, IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { EStudieandel, StudieandelTilTekst, UtdanningsformTilTekst } from '../Aktivitet/typer';
import styled from 'styled-components';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const UtgiftContainer = styled.div<{ kolonneBredde: string }>`
    display: grid;
    grid-template-columns: ${(props) => props.kolonneBredde};
`;

const HøyrestiltTekst = styled(Normaltekst)`
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

    const utledVisningForStudiebelastning = (utdanning?: IUnderUtdanning): string => {
        if (utdanning) {
            return utdanning.heltidEllerDeltid === EStudieandel.heltid
                ? StudieandelTilTekst[utdanning.heltidEllerDeltid]
                : `${utdanning.heltidEllerDeltid} - ${utdanning.hvorMyeSkalDuStudere}%`;
        }
        return 'Ikke oppgitt av bruker';
    };

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
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Semesteravgift</Normaltekst>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        <Normaltekst>
                            {utledUtgiftsbeløp(underUtdanning?.semesteravgift)}
                        </Normaltekst>
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Studieavgift</Normaltekst>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        <Normaltekst>{utledUtgiftsbeløp(underUtdanning?.studieavgift)}</Normaltekst>
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Eksamensgebyr</Normaltekst>
                <UtgiftContainer kolonneBredde={kolonnebredde}>
                    <HøyrestiltTekst>
                        <Normaltekst>
                            {utledUtgiftsbeløp(underUtdanning?.eksamensgebyr)}
                        </Normaltekst>
                    </HøyrestiltTekst>
                </UtgiftContainer>
            </>
        </>
    );
};

export default Dokumentasjonsvisning;
