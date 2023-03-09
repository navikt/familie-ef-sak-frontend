import React, { useEffect, useState } from 'react';
import {
    BrevStruktur,
    Delmal,
    erDelmalBlokk,
    erDelmalGruppe,
    erFritekstblokk,
    Flettefelter,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    Fritekstområder,
    ValgFelt,
    ValgteDelmaler,
    ValgtFelt,
} from './BrevTyper';
import { BrevMenyDelmal } from './BrevMenyDelmal';
import {
    finnFletteFeltApinavnFraRef,
    grupperBrevmenyBlokker,
    harValgfeltFeil,
    initFlettefelterMedVerdi,
    initValgteFelt,
} from './BrevUtils';
import { Ressurs } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import { BrevmenyProps } from './Brevmeny';
import { apiLoggFeil } from '../../../App/api/axios';
import { IBrevverdier, useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import { useDebouncedCallback } from 'use-debounce';
import { IBeløpsperiode, IBeregningsperiodeBarnetilsyn } from '../../../App/typer/vedtak';
import { Alert, Heading, Panel } from '@navikt/ds-react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { delmalTilUtregningstabellOS } from './UtregningstabellOvergangsstønad';
import { delmalTilUtregningstabellBT } from './UtregningstabellBarnetilsyn';
import { useVerdierForBrev } from '../../../App/hooks/useVerdierForBrev';
import { Fritekstområde } from './Fritekstområde';

const BrevFelter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 0;
    min-width: 450px;
`;

const BrevMenyTittel = styled.div`
    margin-bottom: 1rem;
`;

const BrevMenyDelmalWrapper = styled.div<{ førsteElement?: boolean }>`
    margin-top: ${(props) => (props.førsteElement ? '0' : '1rem')};
`;

export interface BrevmenyVisningProps extends BrevmenyProps {
    brevStruktur: BrevStruktur;
    beløpsperioder?: IBeløpsperiode[] | IBeregningsperiodeBarnetilsyn[];
    mellomlagretBrevVerdier?: string;
    brevMal: string;
    stønadstype: Stønadstype;
}

const BrevmenyVisning: React.FC<BrevmenyVisningProps> = ({
    oppdaterBrevRessurs,
    behandlingId,
    personopplysninger,
    settKanSendesTilBeslutter,
    brevStruktur,
    beløpsperioder,
    mellomlagretBrevVerdier,
    brevMal,
    stønadstype,
}) => {
    const { axiosRequest } = useApp();
    const { mellomlagreSanitybrev } = useMellomlagringBrev(behandlingId);
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>([]);
    const [brevmalFeil, settBrevmalFeil] = useState('');
    const { flettefeltStore, valgfeltStore, delmalStore } = useVerdierForBrev(beløpsperioder);

    useEffect(() => {
        const parsetMellomlagretBrev =
            mellomlagretBrevVerdier && (JSON.parse(mellomlagretBrevVerdier) as IBrevverdier);

        const {
            flettefeltFraMellomlager,
            valgteFeltFraMellomlager,
            valgteDelmalerFraMellomlager,
            fritekstområderFraMellomlager,
        } = parsetMellomlagretBrev || {};
        settAlleFlettefelter(
            initFlettefelterMedVerdi(brevStruktur, flettefeltFraMellomlager, flettefeltStore)
        );
        settValgteFelt(initValgteFelt(valgteFeltFraMellomlager, brevStruktur, valgfeltStore));
        if (valgteDelmalerFraMellomlager) {
            settValgteDelmaler(valgteDelmalerFraMellomlager);
        }

        if (fritekstområderFraMellomlager) {
            settFritekstområder(fritekstområderFraMellomlager);
        }

        if (delmalStore.length > 0) {
            settValgteDelmaler((prevState) => ({
                ...prevState,
                ...delmalStore.reduce((acc, delmal) => ({ ...acc, [delmal.delmal]: true }), {}),
            }));
        }
        // eslint-disable-next-line
    }, [brevStruktur, flettefeltStore, mellomlagretBrevVerdier]);

    const [valgteFelt, settValgteFelt] = useState<ValgtFelt>({});
    const [valgteDelmaler, settValgteDelmaler] = useState<ValgteDelmaler>({});
    const [fritekstområder, settFritekstområder] = useState<Fritekstområder>({});

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

    const utledHtmlFelterPåStønadstype = (stønadstype: Stønadstype) => {
        switch (stønadstype) {
            case Stønadstype.OVERGANGSSTØNAD:
                return delmalTilUtregningstabellOS(beløpsperioder as IBeløpsperiode[]);
            case Stønadstype.BARNETILSYN:
                return delmalTilUtregningstabellBT(
                    beløpsperioder as IBeregningsperiodeBarnetilsyn[]
                );
            case Stønadstype.SKOLEPENGER:
                return null;
        }
    };

    const utledDelmalerForBrev = () => {
        return brevStruktur.dokument.brevmenyBlokker.reduce((acc, blokk) => {
            return erDelmalBlokk(blokk) && valgteDelmaler[blokk.blokk.delmalApiNavn]
                ? {
                      ...acc,
                      [blokk.blokk.delmalApiNavn]: [
                          {
                              flettefelter: lagFlettefelterForDelmal(
                                  blokk.blokk.delmalFlettefelter
                              ),
                              valgfelter: lagValgfelterForDelmal(blokk.blokk.delmalValgfelt),
                              htmlfelter: utledHtmlFelterPåStønadstype(stønadstype),
                          },
                      ],
                  }
                : acc;
        }, {});
    };

    const utledFritekstområderForBrev = () => {
        if (Object.keys(fritekstområder).length === 0) return {};
        return brevStruktur.dokument.brevmenyBlokker.reduce((acc, blokk) => {
            return erFritekstblokk(blokk) && fritekstområder[blokk.blokk.id]
                ? {
                      ...acc,
                      [blokk.blokk.id]: fritekstområder[blokk.blokk.id],
                  }
                : acc;
        }, {});
    };

    const genererBrev = () => {
        if (harValgfeltFeil(valgteFelt, brevStruktur, settBrevmalFeil)) {
            return;
        }

        mellomlagreSanitybrev(
            alleFlettefelter,
            valgteFelt,
            valgteDelmaler,
            fritekstområder,
            brevMal
        );
        axiosRequest<string, unknown>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}`,
            data: {
                valgfelter: {},
                delmaler: utledDelmalerForBrev(),
                flettefelter: {
                    navn: [personopplysninger.navn.visningsnavn],
                    fodselsnummer: [personopplysninger.personIdent],
                },
                fritekstområder: utledFritekstområderForBrev(),
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
        fritekstområder,
    ]);

    const brevmenyBlokkerGruppert = grupperBrevmenyBlokker(brevStruktur.dokument.brevmenyBlokker);
    return (
        <BrevFelter>
            {brevmalFeil && <Alert variant={'warning'}>{brevmalFeil}</Alert>}
            {brevmenyBlokkerGruppert.map((gruppe, indeks) => {
                if (erDelmalGruppe(gruppe)) {
                    const alleDelmalerSkjules = gruppe.delmaler.every((delmal) => {
                        const automatiskFeltSomSkalSkjules = delmalStore.find(
                            (mal) => mal.delmal === delmal.delmalApiNavn
                        )?.skjulIBrevmeny;
                        return automatiskFeltSomSkalSkjules || false;
                    });
                    if (alleDelmalerSkjules) {
                        return null;
                    }
                    return (
                        <Panel key={gruppe.gruppeVisningsnavn}>
                            {gruppe.gruppeVisningsnavn !== 'undefined' && (
                                <BrevMenyTittel>
                                    <Heading size={'small'} level={'5'}>
                                        {gruppe.gruppeVisningsnavn}
                                    </Heading>
                                </BrevMenyTittel>
                            )}
                            {gruppe.delmaler.map((delmal: Delmal, index: number) => {
                                const automatiskFeltsomSkalSkjules = delmalStore.find(
                                    (mal) => mal.delmal === delmal.delmalApiNavn
                                )?.skjulIBrevmeny;
                                const skjulDelmal = automatiskFeltsomSkalSkjules || false;
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
                                            skjul={skjulDelmal}
                                        />
                                    </BrevMenyDelmalWrapper>
                                );
                            })}
                        </Panel>
                    );
                } else {
                    return (
                        <Fritekstområde
                            key={indeks}
                            id={gruppe.fritekstområde.blokk.id}
                            fritekstområder={fritekstområder}
                            settFritekstområder={settFritekstområder}
                        />
                    );
                }
            })}
        </BrevFelter>
    );
};

export default BrevmenyVisning;
