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
import styled from 'styled-components';
import { Accordion } from '@navikt/ds-react';
import { NavdsBorderRadiusMedium, NavdsSemanticColorBorder } from '@navikt/ds-tokens/dist/tokens';

const DelmalValg = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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

        if (!ekspanderbartPanelÅpen && !valgt) {
            settEkspanderbartPanelÅpen(true);
        }

        settKanSendeTilBeslutter(false);
    };

    return (
        <DelmalValg>
            <Checkbox label="" onChange={håndterToggleDelmal} checked={valgt} />
            <Accordion
                style={{
                    width: '100%',
                    border: `1px solid ${NavdsSemanticColorBorder}`,
                    borderRadius: `${NavdsBorderRadiusMedium}`,
                }}
            >
                <Accordion.Item open={ekspanderbartPanelÅpen}>
                    <Accordion.Header
                        style={{
                            borderRadius: `${NavdsBorderRadiusMedium}`,
                            border: 'none',
                        }}
                        onClick={() => settEkspanderbartPanelÅpen(!ekspanderbartPanelÅpen)}
                    >
                        {delmal?.delmalNavn}
                    </Accordion.Header>
                    <Accordion.Content style={{ border: 'none', padding: '1rem' }}>
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
                        {delmalFlettefelter
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
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </DelmalValg>
    );
};
