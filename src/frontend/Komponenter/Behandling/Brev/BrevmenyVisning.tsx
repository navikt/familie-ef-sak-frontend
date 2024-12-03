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
    erAutomatiskFeltSomSkalSkjules,
    finnFletteFeltApinavnFraRef,
    grupperBrevmenyBlokker,
    harValgfeltFeil,
    initFlettefelterMedVerdi,
    initValgteFelt,
    skalSkjuleAlleDelmaler,
} from './BrevUtils';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import styled from 'styled-components';
import { apiLoggFeil } from '../../../App/api/axios';
import { IBrevverdier, MellomlagreSanitybrev } from '../../../App/hooks/useMellomlagringBrev';
import { useDebouncedCallback } from 'use-debounce';
import { Alert, Heading, Panel } from '@navikt/ds-react';
import { Brevverdier } from '../../../App/hooks/useVerdierForBrev';
import { Fritekstområde } from './Fritekstområde';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';

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

const BrevMenyDelmalWrapper = styled.div<{ $førsteElement?: boolean }>`
    margin-top: ${(props) => (props.$førsteElement ? '0' : '1rem')};
`;

export type BrevmenyVisningProps = {
    brevStruktur: BrevStruktur;
    mellomlagretBrevVerdier?: string;
    mellomlagreSanityBrev: MellomlagreSanitybrev;
    brevMal: string;
    personopplysninger: IPersonopplysninger;
    settBrevOppdatert: (brevOppdatert: boolean) => void;
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    htmlFelter?: { [htmlfeltNavn: string]: string } | undefined | null;
    brevverdier: Brevverdier;
} & ({ fagsakId: string; behandlingId?: never } | { behandlingId: string; fagsakId?: never });

const BrevmenyVisning: React.FC<BrevmenyVisningProps> = ({
    oppdaterBrevRessurs,
    personopplysninger,
    settBrevOppdatert,
    brevStruktur,
    mellomlagretBrevVerdier,
    brevMal,
    mellomlagreSanityBrev,
    htmlFelter,
    brevverdier,
    fagsakId,
    behandlingId,
}) => {
    const { axiosRequest } = useApp();
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>([]);
    const [brevmalFeil, settBrevmalFeil] = useState('');
    const { flettefeltStore, delmalStore, valgfeltStore } = brevverdier;

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
    }, [brevStruktur, flettefeltStore, delmalStore, valgfeltStore, mellomlagretBrevVerdier]);

    const [valgteFelt, settValgteFelt] = useState<ValgtFelt>({});
    const [valgteDelmaler, settValgteDelmaler] = useState<ValgteDelmaler>({});
    const [konverterteDelmaler, settKonverterteDelmaler] = useState<ValgteDelmaler>({}); // TODO: Må inneholde html fra familie-brev / oppdatert tekstfelt også (!)
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

    const utledDelmalerForBrev = () => {
        return brevStruktur.dokument.brevmenyBlokker.reduce((acc, blokk) => {
            return erDelmalBlokk(blokk) && valgteDelmaler[blokk.innhold.delmalApiNavn]
                ? {
                      ...acc,
                      [blokk.innhold.delmalApiNavn]: [
                          {
                              flettefelter: lagFlettefelterForDelmal(
                                  blokk.innhold.delmalFlettefelter
                              ),
                              valgfelter: lagValgfelterForDelmal(blokk.innhold.delmalValgfelt),
                              htmlfelter: htmlFelter,
                          },
                      ],
                  }
                : acc;
        }, {});
    };

    const utledFritekstområderForBrev = () => {
        if (Object.keys(fritekstområder).length === 0) return {};
        return brevStruktur.dokument.brevmenyBlokker.reduce((acc, blokk) => {
            return erFritekstblokk(blokk) && fritekstområder[blokk.innhold.id]
                ? {
                      ...acc,
                      [blokk.innhold.id]: fritekstområder[blokk.innhold.id],
                  }
                : acc;
        }, {});
    };

    const genererBrev = () => {
        if (harValgfeltFeil(valgteFelt, brevStruktur, settBrevmalFeil)) {
            return;
        }

        mellomlagreSanityBrev(
            alleFlettefelter,
            valgteFelt,
            valgteDelmaler,
            fritekstområder,
            brevMal
        );

        const url = behandlingId
            ? `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}`
            : `/familie-ef-sak/api/frittstaende-brev/${fagsakId}/${brevMal}`;

        axiosRequest<string, unknown>({
            method: 'POST',
            url: url,
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
            if (respons.status === RessursStatus.SUKSESS) {
                settBrevOppdatert(true);
            }
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

    const konverterDelmal = (delmal: Delmal, tilTekstfelt: boolean) => {
        // TODO: Gjør et kall mot familie-brev
        settKonverterteDelmaler((prevState) => ({
            ...prevState,
            [delmal.delmalApiNavn]: tilTekstfelt,
        }));
    };

    return (
        <BrevFelter>
            {brevmalFeil && <Alert variant={'warning'}>{brevmalFeil}</Alert>}
            {brevmenyBlokkerGruppert.map((gruppe, indeks) => {
                if (erDelmalGruppe(gruppe)) {
                    if (skalSkjuleAlleDelmaler(gruppe, delmalStore)) return null;
                    return (
                        <Panel key={`${gruppe.gruppeVisningsnavn}_${indeks}`}>
                            {gruppe.gruppeVisningsnavn !== 'undefined' && (
                                <BrevMenyTittel>
                                    <Heading size={'small'} level={'5'}>
                                        {gruppe.gruppeVisningsnavn}
                                    </Heading>
                                </BrevMenyTittel>
                            )}
                            {gruppe.delmaler.map((delmal: Delmal, index: number) => (
                                <BrevMenyDelmalWrapper
                                    $førsteElement={index === 0}
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
                                        settBrevOppdatert={settBrevOppdatert}
                                        skjul={erAutomatiskFeltSomSkalSkjules(delmalStore, delmal)}
                                        konverterDelmal={konverterDelmal}
                                        erKonvertert={konverterteDelmaler[delmal.delmalApiNavn]}
                                        konvertertInnhold={
                                            konverterteDelmaler[delmal.delmalApiNavn]
                                                ? `<div style="min-height:1rem" class="block"></div>
<div class="valgfelt">
    <div style="min-height:1rem" class="block">Du får overgangsstønad fra <span class="">01.01.2024</span>, som er
        måneden etter at du kom tilbake til Norge etter opphold i utlandet.</div>
</div>`
                                                : undefined
                                        }
                                    />
                                </BrevMenyDelmalWrapper>
                            ))}
                        </Panel>
                    );
                } else {
                    return (
                        <Fritekstområde
                            key={indeks}
                            id={gruppe.fritekstområde.innhold.id}
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
