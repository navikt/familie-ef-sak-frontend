import React, { useEffect, useState } from 'react';
import {
    BrevStruktur,
    Delmal,
    Flettefelter,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    Htmlfeltreferanse,
    ValgFelt,
    ValgteDelmaler,
    ValgtFelt,
} from './BrevTyper';
import { Undertittel } from 'nav-frontend-typografi';
import { Input, Textarea } from 'nav-frontend-skjema';
import { BrevMenyDelmal } from './BrevMenyDelmal';
import {
    finnFletteFeltApinavnFraRef,
    grupperDelmaler,
    initFlettefelterMedVerdi,
    initValgteFeltMedMellomlager,
} from './BrevUtils';
import { Ressurs } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import Panel from 'nav-frontend-paneler';
import { BrevmenyProps } from './Brevmeny';
import { apiLoggFeil } from '../../../App/api/axios';
import { delmalTilHtml } from './Htmlfelter';
import { BrevMenyHtmlfelter } from './BrevMenyHtmlfelter';
import { TilkjentYtelse } from '../../../App/typer/tilkjentytelse';
import { IBrevverdier, useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import { useDebouncedCallback } from 'use-debounce';

const BrevFelter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 0;
    min-width: 450px;
`;

const BrevMenyTittel = styled(Undertittel)`
    margin-bottom: 1rem;
`;

const BrevMenyDelmalWrapper = styled.div<{ førsteElement?: boolean }>`
    margin-top: ${(props) => (props.førsteElement ? '0' : '1rem')};
`;

const StyledInput = styled(({ fetLabel, ...props }) => <Input {...props} />)`
    padding-top: 0.5rem;
    .skjemaelement__label {
        font-weight: 600;
    }
`;

export interface BrevmenyVisningProps extends BrevmenyProps {
    brevStruktur: BrevStruktur;
    tilkjentYtelse?: TilkjentYtelse;
    mellomlagretBrevVerdier?: string;
    brevMal: string;
    flettefeltStore: { [navn: string]: string };
}

const BrevmenyVisning: React.FC<BrevmenyVisningProps> = ({
    oppdaterBrevRessurs,
    behandlingId,
    personopplysninger,
    settKanSendesTilBeslutter,
    brevStruktur,
    tilkjentYtelse,
    mellomlagretBrevVerdier,
    brevMal,
    flettefeltStore,
}) => {
    const { axiosRequest } = useApp();
    const { mellomlagreSanitybrev } = useMellomlagringBrev(behandlingId);
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>([]);
    const [htmlfelterSomVises, settHtmlFelterSomVises] = useState<any>([]);

    useEffect(() => {
        const parsetMellomlagretBrev =
            mellomlagretBrevVerdier && (JSON.parse(mellomlagretBrevVerdier) as IBrevverdier);

        const { flettefeltFraMellomlager, valgteFeltFraMellomlager, valgteDelmalerFraMellomlager } =
            parsetMellomlagretBrev || {};
        settAlleFlettefelter(
            initFlettefelterMedVerdi(brevStruktur, flettefeltFraMellomlager, flettefeltStore)
        );
        settValgteFelt(initValgteFeltMedMellomlager(valgteFeltFraMellomlager, brevStruktur));
        if (valgteDelmalerFraMellomlager) {
            settValgteDelmaler(valgteDelmalerFraMellomlager);
        }
    }, [brevStruktur, flettefeltStore, mellomlagretBrevVerdier]);

    const [valgteFelt, settValgteFelt] = useState<ValgtFelt>({});
    const [valgteDelmaler, settValgteDelmaler] = useState<ValgteDelmaler>({});

    const lagFlettefelterForDelmal = (delmalflettefelter: Flettefelter[]) => {
        return delmalflettefelter.reduce((acc, flettefeltAvsnitt) => {
            const nyttAvsnitt = lagFlettefeltForAvsnitt(flettefeltAvsnitt.flettefelt);
            return { ...acc, ...nyttAvsnitt };
        }, {});
    };

    const lagValgfelterForDelmal = (delmalValgfelter: ValgFelt[]) => {
        return delmalValgfelter.reduce((acc, valgfelt) => {
            const valgtMulighet = valgteFelt[valgfelt.valgFeltApiNavn];
            if (!valgtMulighet) {
                return acc;
            }
            const flettefelterMedReferanse: Flettefeltreferanse[] =
                valgtMulighet.flettefelter.flatMap((felter) => felter.flettefelt);
            const flettefelterForValg = lagFlettefeltForAvsnitt(flettefelterMedReferanse);

            const valgMedflettefelt = {
                [valgfelt.valgFeltApiNavn]: [
                    {
                        navn: valgtMulighet.valgmulighet,
                        dokumentVariabler: { flettefelter: flettefelterForValg },
                    },
                ],
            };
            return { ...acc, ...valgMedflettefelt };
        }, {});
    };

    const lagFlettefeltForAvsnitt = (flettefelter: Flettefeltreferanse[]) => {
        return flettefelter.reduce((acc, flettefeltreferanse) => {
            const nyttFeltNavn = finnFletteFeltApinavnFraRef(
                brevStruktur,
                flettefeltreferanse._ref
            );
            const nyttFlettefelt = alleFlettefelter.find(
                (flettefelt) => flettefeltreferanse._ref === flettefelt._ref
            );
            if (!nyttFlettefelt) {
                apiLoggFeil(
                    `Finner ikke flettefelt for ref=${flettefeltreferanse._ref} nyttFeltNavn=${nyttFeltNavn}`
                );
                return acc;
            }
            return { ...acc, [nyttFeltNavn]: [nyttFlettefelt.verdi] };
        }, {});
    };

    const dokumentHarHtmlfelter = brevStruktur?.htmlfelter?.htmlfeltReferanse?.some(
        (htmlfelt: any) => {
            const htmlfelterForDokument = brevStruktur?.dokument?.dokumentHtmlfelter.map(
                (htmlfelt: any) => htmlfelt.felt
            );

            return htmlfelterForDokument.indexOf(htmlfelt.felt) > -1;
        }
    );

    const utledDelmalerForBrev = () => {
        return brevStruktur.dokument.delmalerSortert.reduce((acc, delmal) => {
            return valgteDelmaler[delmal.delmalApiNavn]
                ? {
                      ...acc,
                      [delmal.delmalApiNavn]: [
                          {
                              flettefelter: lagFlettefelterForDelmal(delmal.delmalFlettefelter),
                              valgfelter: lagValgfelterForDelmal(delmal.delmalValgfelt),
                          },
                      ],
                  }
                : acc;
        }, {});
    };

    const genererBrev = () => {
        mellomlagreSanitybrev(alleFlettefelter, valgteFelt, valgteDelmaler, brevMal);
        axiosRequest<string, unknown>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}`,
            data: {
                valgfelter: {},
                delmaler: utledDelmalerForBrev(),
                htmlfelter: delmalTilHtml(tilkjentYtelse, htmlfelterSomVises),
                flettefelter: {
                    navn: [personopplysninger.navn.visningsnavn],
                    fodselsnummer: [personopplysninger.personIdent],
                },
            },
        }).then((respons: Ressurs<string>) => {
            oppdaterBrevRessurs(respons);
        });
    };

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);

    useEffect(utsattGenererBrev, [
        utsattGenererBrev,
        alleFlettefelter,
        valgteFelt,
        valgteDelmaler,
        behandlingId,
        brevMal,
        htmlfelterSomVises,
    ]);

    const delmalerGruppert = grupperDelmaler(brevStruktur.dokument.delmalerSortert);
    return (
        <BrevFelter>
            {dokumentHarHtmlfelter && (
                <BrevMenyHtmlfelter
                    dokument={brevStruktur}
                    htmlfelterSomVises={htmlfelterSomVises}
                    settHtmlfelterSomVises={settHtmlFelterSomVises}
                />
            )}
            {Object.entries(delmalerGruppert).map(([key, delmaler]: [string, Delmal[]]) => {
                return (
                    <Panel key={key}>
                        {key !== 'undefined' && <BrevMenyTittel>{key}</BrevMenyTittel>}
                        {delmaler.map((delmal: Delmal, index: number) => {
                            return (
                                <BrevMenyDelmalWrapper
                                    førsteElement={index === 0}
                                    key={`${delmal.delmalApiNavn}_wrapper`}
                                >
                                    <BrevMenyDelmal
                                        valgt={!!valgteDelmaler[delmal.delmalApiNavn]}
                                        delmal={delmal}
                                        dokument={brevStruktur}
                                        valgteFelt={valgteFelt}
                                        settValgteFelt={settValgteFelt}
                                        flettefelter={alleFlettefelter}
                                        settFlettefelter={settAlleFlettefelter}
                                        settValgteDelmaler={settValgteDelmaler}
                                        key={delmal.delmalApiNavn}
                                        settKanSendeTilBeslutter={settKanSendesTilBeslutter}
                                    />
                                </BrevMenyDelmalWrapper>
                            );
                        })}
                    </Panel>
                );
            })}
        </BrevFelter>
    );
};

export default BrevmenyVisning;
