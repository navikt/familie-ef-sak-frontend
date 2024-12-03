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
import styled from 'styled-components';
import { Accordion, Button, Checkbox } from '@navikt/ds-react';
import { ABorderRadiusMedium, ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import HtmlEditor from '../../../Felles/HtmlEditor/HtmlEditor';

const DelmalValg = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.5rem;
`;

const AccordionInnhold = styled(Accordion.Content)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: none;
    padding: 1rem;
`;

interface Props {
    delmal: Delmal;
    dokument: BrevStruktur;
    valgteFelt: ValgtFelt;
    settValgteFelt: Dispatch<SetStateAction<ValgtFelt>>;
    settFlettefelter: Dispatch<SetStateAction<FlettefeltMedVerdi[]>>;
    flettefelter: FlettefeltMedVerdi[];
    settValgteDelmaler: Dispatch<SetStateAction<Record<string, boolean>>>;
    settBrevOppdatert: (kanSendeTilBeslutter: boolean) => void;
    valgt: boolean;
    skjul: boolean;
    konverterDelmal: (delmal: Delmal, tilTekstfelt: boolean) => void;
    erKonvertert: boolean;
    konvertertInnhold?: string;
}

export const BrevMenyDelmal: React.FC<Props> = ({
    delmal,
    dokument,
    valgteFelt,
    settValgteFelt,
    settFlettefelter,
    flettefelter,
    settValgteDelmaler,
    settBrevOppdatert,
    valgt,
    skjul,
    konverterDelmal,
    erKonvertert,
    konvertertInnhold,
}) => {
    const { delmalValgfelt, delmalFlettefelter } = delmal;
    const [ekspanderbartPanelÅpen, settEkspanderbartPanelÅpen] = useState(false);

    const handleFlettefeltInput = (verdi: string, flettefelt: Flettefeltreferanse) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
        settBrevOppdatert(false);
    };

    const håndterToggleDelmal = (e: React.ChangeEvent<HTMLInputElement>) => {
        settValgteDelmaler((prevState) => ({
            ...prevState,
            [delmal.delmalApiNavn]: e.target.checked,
        }));

        if (!ekspanderbartPanelÅpen && !valgt) {
            settEkspanderbartPanelÅpen(true);
        }

        settBrevOppdatert(false);
    };

    if (skjul) {
        return null;
    }

    return (
        <DelmalValg>
            <Checkbox hideLabel onChange={håndterToggleDelmal} checked={valgt}>
                Velg delmal
            </Checkbox>
            <Accordion
                style={{
                    width: '100%',
                    border: `1px solid ${ABorderStrong}`,
                    borderRadius: `${ABorderRadiusMedium}`,
                }}
            >
                <Accordion.Item open={ekspanderbartPanelÅpen}>
                    <Accordion.Header
                        style={{
                            borderRadius: `${ABorderRadiusMedium}`,
                            border: 'none',
                        }}
                        onClick={() => settEkspanderbartPanelÅpen(!ekspanderbartPanelÅpen)}
                    >
                        {delmal?.delmalNavn}
                    </Accordion.Header>
                    {ekspanderbartPanelÅpen && (
                        <AccordionInnhold>
                            {!erKonvertert &&
                                delmalValgfelt &&
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
                                        settKanSendeTilBeslutter={settBrevOppdatert}
                                    />
                                ))}
                            {!erKonvertert &&
                                delmalFlettefelter
                                    .flatMap((f) => f.flettefelt)
                                    .filter(
                                        (felt, index, self) =>
                                            self.findIndex((t) => t._ref === felt._ref) === index
                                    )
                                    .map((flettefelt) => (
                                        <Flettefelt
                                            fetLabel={true}
                                            flettefelt={flettefelt}
                                            dokument={dokument}
                                            flettefelter={flettefelter}
                                            handleFlettefeltInput={handleFlettefeltInput}
                                            key={flettefelt._ref}
                                        />
                                    ))}
                            {!erKonvertert && (
                                <Button onClick={() => konverterDelmal(delmal, true)}>
                                    Konverter til tekstfelt
                                </Button>
                            )}
                            {erKonvertert && (
                                <>
                                    <HtmlEditor
                                        defaultValue={konvertertInnhold}
                                        onTextChange={(x) => {
                                            console.log(x);
                                            // TODO: Oppdater brevmal-verdi og generer brev
                                        }}
                                    />
                                    <Button onClick={() => konverterDelmal(delmal, false)}>
                                        Konverter tilbake
                                    </Button>
                                </>
                            )}
                        </AccordionInnhold>
                    )}
                </Accordion.Item>
            </Accordion>
        </DelmalValg>
    );
};
