import {
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgtFelt,
} from './BrevTyper';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ValgfeltSelect } from './ValgfeltSelect';
import { Flettefelt } from './Flettefelt';
import { Checkbox } from 'nav-frontend-skjema';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import styled from 'styled-components';

const DelmalValg = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
`;

const StyledEkspanderbartpanelBase = styled(EkspanderbartpanelBase)`
    flex: 100%;
`;

interface Props {
    delmal: Delmal;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
    settValgteDelmaler: Dispatch<SetStateAction<Record<string, boolean>>>;
    settKanSendeTilBeslutter: (kanSendeTilBeslutter: boolean) => void;
    valgt: boolean;
}

export const BrevMenyDelmal: React.FC<Props> = ({
    delmal,
    dokument,
    valgteFelt,
    settValgteFelt,
    settFlettefelter,
    flettefelter,
    settValgteDelmaler,
    settKanSendeTilBeslutter,
    valgt,
}) => {
    const { delmalValgfelt, delmalFlettefelter } = delmal;
    const [ekspanderbartPanelÅpen, settEkspanderbartPanelÅpen] = useState(false);
    const [checkboxValgt, settCheckboxValgt] = useState<boolean>(valgt);

    const handleFlettefeltInput = (verdi: string, flettefelt: Flettefeltreferanse) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
        settKanSendeTilBeslutter(false);
    };

    const håndterToggleDelmal = (e: React.ChangeEvent<HTMLInputElement>) => {
        settValgteDelmaler((prevState) => ({
            ...prevState,
            [delmal.delmalApiNavn]: e.target.checked,
        }));

        if (!ekspanderbartPanelÅpen && !checkboxValgt) {
            settEkspanderbartPanelÅpen(true);
        }

        settCheckboxValgt(e.target.checked);

        settKanSendeTilBeslutter(false);
    };

    return (
        <DelmalValg>
            <Checkbox label="" onChange={håndterToggleDelmal} checked={checkboxValgt} />
            <StyledEkspanderbartpanelBase
                tittel={delmal?.delmalNavn}
                apen={ekspanderbartPanelÅpen}
                onClick={() => {
                    settEkspanderbartPanelÅpen(!ekspanderbartPanelÅpen);
                }}
            >
                {delmalValgfelt &&
                    delmalValgfelt.map((valgFelt, index) => (
                        <ValgfeltSelect
                            valgFelt={valgFelt}
                            dokument={dokument}
                            valgteFelt={valgteFelt}
                            settValgteFelt={settValgteFelt}
                            flettefelter={flettefelter}
                            settFlettefelter={settFlettefelter}
                            handleFlettefeltInput={handleFlettefeltInput}
                            delmal={delmal}
                            key={`${valgteFelt.valgFeltKategori}${index}`}
                            settKanSendeTilBeslutter={settKanSendeTilBeslutter}
                        />
                    ))}

                {delmalFlettefelter.flatMap((f) =>
                    f.flettefelt.map((flettefelt) => (
                        <Flettefelt
                            fetLabel={true}
                            flettefelt={flettefelt}
                            dokument={dokument}
                            flettefelter={flettefelter}
                            handleFlettefeltInput={handleFlettefeltInput}
                            key={flettefelt._ref}
                        />
                    ))
                )}
            </StyledEkspanderbartpanelBase>
        </DelmalValg>
    );
};
