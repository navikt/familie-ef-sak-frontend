import React, { Dispatch, SetStateAction } from 'react';
import {
    BrevStruktur,
    Delmal,
    Flettefeltreferanse,
    FlettefeltMedVerdi,
    Valgmulighet,
} from './Brev';
import { Input, Select } from 'nav-frontend-skjema';

type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };

interface Props {
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
}

const Brevmeny: React.FC<Props> = ({
    dokument,
    settValgteFelt,
    valgteFelt,
    settFlettefelter,
    flettefelter,
}) => {
    const doSettValgteFelt = (
        valgFeltApiNavn: string,
        valgmulighetNavn: string,
        delmal: Delmal
    ) => {
        if (!valgmulighetNavn) {
            const nyState = { ...valgteFelt };
            delete nyState[valgFeltApiNavn];
            settValgteFelt(nyState);
            return;
        }
        const valgmulighet = delmal.delmalValgfelt
            .find((valgFelt) => valgFelt.valgFeltApiNavn === valgFeltApiNavn)!
            .valgMuligheter.find((valgmulighet) => valgmulighet.valgmulighet === valgmulighetNavn)!;

        settValgteFelt((prevState) => {
            return {
                ...prevState,
                [valgFeltApiNavn]: valgmulighet,
            };
        });
    };

    const handleFlettefeltInput = (verdi: string, flettefelt: Flettefeltreferanse) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
    };

    const finnFlettefeltNavnFraRef = (ref: string) => {
        return dokument.flettefelter.flettefeltReferanse.find((felt) => felt._id === ref)!.felt;
    };

    return (
        <>
            {dokument.dokument.delmaler.map((delmal, index) => {
                const { delmalValgfelt, delmalFlettefelter } = delmal;

                return (
                    <>
                        {delmalValgfelt.map((valgFelt) => {
                            return (
                                <>
                                    <Select
                                        label={valgFelt.valgfeltVisningsnavn}
                                        onChange={(e) =>
                                            doSettValgteFelt(
                                                valgFelt.valgFeltApiNavn,
                                                e.target.value,
                                                delmal
                                            )
                                        }
                                    >
                                        <option value="">Velg land</option>
                                        {valgFelt.valgMuligheter.map(
                                            (valMulighet: Valgmulighet) => (
                                                <option
                                                    value={valMulighet.valgmulighet}
                                                    key={valMulighet.valgmulighet}
                                                >
                                                    {valMulighet.visningsnavnValgmulighet}
                                                </option>
                                            )
                                        )}
                                    </Select>
                                </>
                            );
                        })}

                        {delmalFlettefelter.flatMap((f) =>
                            f.flettefelt.map((flettefelt) => (
                                <Input
                                    label={finnFlettefeltNavnFraRef(flettefelt._ref)}
                                    onChange={(e) => {
                                        handleFlettefeltInput(e.target.value, flettefelt);
                                    }}
                                    value={
                                        (
                                            flettefelter.find(
                                                (felt) => felt._ref === flettefelt._ref
                                            ) ?? { verdi: '' }
                                        ).verdi || ''
                                    }
                                />
                            ))
                        )}
                    </>
                );
            })}
        </>
    );
};

export default Brevmeny;
