import React, { useState } from 'react';
import {
    BrevStruktur,
    Delmal,
    Flettefelter,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    TilkjentYtelse,
    ValgFelt,
    ValgtFelt,
} from './BrevTyper';
import { Systemtittel } from 'nav-frontend-typografi';
import { BrevMenyDelmal } from './BrevMenyDelmal';
import { Ressurs } from '../../../typer/ressurs';
import { finnFletteFeltApinavnFraRef, grupperDelmaler } from './BrevUtils';
import { useApp } from '../../../context/AppContext';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { dagensDatoFormatert } from '../../../utils/formatter';
import Panel from 'nav-frontend-paneler';
import { brevMal, BrevmenyProps } from './Brevmeny';
import { apiLoggFeil } from '../../../api/axios';
import { delmalTilHtml } from './Htmlfelter';

const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const StyledBrevMeny = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 1rem;
    min-width: 450px;
`;

const BrevMenyTittel = styled(Systemtittel)`
    margin-bottom: 1rem;
`;

const BrevMenyDelmalWrapper = styled.div<{ førsteElement?: boolean }>`
    margin-top: ${(props) => (props.førsteElement ? '0' : '1rem')};
`;

const initFlettefelterMedVerdi = (brevStruktur: BrevStruktur): FlettefeltMedVerdi[] =>
    brevStruktur.flettefelter.flettefeltReferanse.map((felt) => ({
        _ref: felt._id,
        verdi: null,
    }));

export interface BrevmenyVisningProps extends BrevmenyProps {
    brevStruktur: BrevStruktur;
    tilkjentYtelse?: TilkjentYtelse;
}

const BrevmenyVisning: React.FC<BrevmenyVisningProps> = ({
    oppdaterBrevRessurs,
    behandlingId,
    personopplysninger,
    settKanSendesTilBeslutter,
    brevStruktur,
    tilkjentYtelse,
}) => {
    const { axiosRequest } = useApp();
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>(
        initFlettefelterMedVerdi(brevStruktur)
    );
    const [valgteFelt, settValgteFelt] = useState<ValgtFelt>({});
    const [valgteDelmaler, settValgteDelmaler] = useState<{ [delmalNavn: string]: boolean }>({});

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
            const flettefelterMedReferanse: Flettefeltreferanse[] = valgtMulighet.flettefelter.flatMap(
                (felter) => felter.flettefelt
            );
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
        return brevStruktur.dokument.delmalerSortert.reduce((acc, delmal) => {
            return valgteDelmaler[delmal.delmalApiNavn]
                ? {
                      ...acc,
                      [delmal.delmalApiNavn]: [
                          {
                              flettefelter: lagFlettefelterForDelmal(delmal.delmalFlettefelter),
                              valgfelter: lagValgfelterForDelmal(delmal.delmalValgfelt),
                              htmlfelter: delmalTilHtml(delmal.delmalApiNavn, tilkjentYtelse),
                          },
                      ],
                  }
                : acc;
        }, {});
    };

    const genererBrev = () => {
        axiosRequest<string, unknown>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}`,
            data: {
                valgfelter: {},
                delmaler: utledDelmalerForBrev(),
                flettefelter: {
                    navn: [personopplysninger.navn.visningsnavn],
                    fodselsnummer: [personopplysninger.personIdent],
                    dato: [dagensDatoFormatert()],
                },
            },
        }).then((respons: Ressurs<string>) => {
            oppdaterBrevRessurs(respons);
        });
    };

    const delmalerGruppert = grupperDelmaler(brevStruktur.dokument.delmalerSortert);
    return (
        <StyledBrevMeny>
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
            <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
        </StyledBrevMeny>
    );
};

export default BrevmenyVisning;
