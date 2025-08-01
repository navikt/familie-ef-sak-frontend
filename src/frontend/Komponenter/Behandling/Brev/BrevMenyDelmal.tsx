import {
    BrevStruktur,
    Delmal,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    OverstyrtDelmal,
    OverstyrteDelmaler,
    ValgtFelt,
} from './BrevTyper';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ValgfeltSelect } from './ValgfeltSelect';
import { Flettefelt } from './Flettefelt';
import styled from 'styled-components';
import { Button, Checkbox, HStack, VStack } from '@navikt/ds-react';
import { ABorderDefault, ABorderRadiusMedium } from '@navikt/ds-tokens/dist/tokens';
import { HtmlEditor } from '../../../Felles/HtmlEditor/HtmlEditor';
import { ArrowsSquarepathIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { finnFlettefeltRefFraFlettefeltApiNavn } from './BrevUtils';
import { formaterTallMedTusenSkille } from '../../../App/utils/formatter';

const DelmalValg = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.5rem;
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
    overstyring: {
        konverterTilHtml: (delmal: Delmal) => void;
        konverterTilDelmalblokk: (delmal: Delmal) => void;
        settOverstyrteDelmaler: Dispatch<SetStateAction<OverstyrteDelmaler>>;
        overstyrtDelmal?: OverstyrtDelmal;
    };
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
    overstyring,
}) => {
    const { delmalValgfelt, delmalFlettefelter } = delmal;

    const [ekspanderbartPanelÅpen, settEkspanderbartPanelÅpen] = useState(false);

    const handleFlettefeltInput = (
        verdi: string,
        flettefelt: Flettefeltreferanse,
        flettefeltApiNavn?: string
    ) => {
        if (flettefeltApiNavn === 'belopIMaaneden') {
            const sanitertVerdi = verdi.replace(/\s/g, '');
            const årsinntektRef = finnFlettefeltRefFraFlettefeltApiNavn(dokument, 'arsinntekt');

            const månedsinntektGangerTolv = formaterTallMedTusenSkille(
                parseInt(sanitertVerdi) * 12
            ).toString();
            oppdaterFlettefeltForGittRef(årsinntektRef, månedsinntektGangerTolv);
        }

        settFlettefelter((prevState) =>
            prevState.map((felt) => (felt._ref === flettefelt._ref ? { ...felt, verdi } : felt))
        );
        settBrevOppdatert(false);
    };

    const oppdaterFlettefeltForGittRef = (flettefeltRef: string, verdi: string) => {
        settFlettefelter((prevState) =>
            prevState.map((felt) =>
                felt._ref === flettefeltRef
                    ? { ...felt, verdi: verdi === 'NaN' ? '' : verdi }
                    : felt
            )
        );
    };

    const oppdaterOverstyrtInnhold = (delmal: Delmal, htmlInnhold: string) => {
        overstyring.settOverstyrteDelmaler((prevState) => ({
            ...prevState,
            [delmal.delmalApiNavn]: { htmlInnhold: htmlInnhold, skalOverstyre: true },
        }));
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

    const erDelmalblokk = overstyring.overstyrtDelmal?.skalOverstyre !== true;

    const ikon = !ekspanderbartPanelÅpen ? (
        <ChevronDownIcon title="a11y-title" fontSize="1.5rem" />
    ) : (
        <ChevronUpIcon title="a11y-title" fontSize="1.5rem" />
    );

    return (
        <DelmalValg>
            <Checkbox hideLabel onChange={håndterToggleDelmal} checked={valgt} size="small">
                Velg delmal
            </Checkbox>
            <VStack
                justify={'start'}
                style={{
                    width: '100%',
                    border: `1px solid ${ABorderDefault}`,
                    borderRadius: `${ABorderRadiusMedium}`,
                }}
            >
                <HStack>
                    <Button
                        variant="tertiary-neutral"
                        size="xsmall"
                        icon={ikon}
                        onClick={() => settEkspanderbartPanelÅpen(!ekspanderbartPanelÅpen)}
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                        {delmal?.delmalNavn}
                    </Button>
                </HStack>
                {ekspanderbartPanelÅpen && (
                    <VStack gap={'4'} style={{ padding: '1rem' }}>
                        {erDelmalblokk &&
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
                        {erDelmalblokk &&
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
                        {erDelmalblokk && (
                            <div>
                                <Button
                                    onClick={() => overstyring.konverterTilHtml(delmal)}
                                    size={'small'}
                                    variant={'secondary'}
                                    icon={<ArrowsSquarepathIcon />}
                                >
                                    Gjør om til tekstfelt
                                </Button>
                            </div>
                        )}
                        {overstyring.overstyrtDelmal?.skalOverstyre && (
                            <>
                                <HtmlEditor
                                    defaultValue={overstyring.overstyrtDelmal.htmlInnhold}
                                    onTextChange={(nyttInnhold) => {
                                        oppdaterOverstyrtInnhold(delmal, nyttInnhold);
                                    }}
                                />
                                <div style={{ marginTop: '2rem' }}>
                                    <Button
                                        onClick={() => overstyring.konverterTilDelmalblokk(delmal)}
                                        size={'small'}
                                        variant={'secondary'}
                                        icon={<ArrowsSquarepathIcon />}
                                    >
                                        Gjør om til brevbygger
                                    </Button>
                                </div>
                            </>
                        )}
                    </VStack>
                )}
            </VStack>
        </DelmalValg>
    );
};
