import React, { Dispatch, useEffect, useState } from 'react';
import {
    BrevStruktur,
    Flettefelter,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgFelt,
    Valgmulighet,
    ValgtFelt,
} from './Brev';
import { BrevMenyDelmal } from './BrevMenyDelmal';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { RessursStatus } from '@navikt/familie-typer';
import { finnFlettefeltNavnFraRef } from './BrevUtils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

interface Props {
    settBrevRessurs: Dispatch<Ressurs<string>>;
    behandlingId: string;
}

const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const Brevmeny: React.FC<Props> = ({ settBrevRessurs, behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>(
        [] as FlettefeltMedVerdi[]
    );
    const [valgteFelt, settValgteFelt] = useState<{ [valgFeltKategori: string]: Valgmulighet }>(
        {} as ValgtFelt
    );
    const [valgteDelmaler, settValgteDelmaler] = useState<{ [delmalNavn: string]: boolean }>({});

    // const brevMal = 'innvilgetOvergangsstonadHovedp';
    const brevMal = 'testMedDelmal';
    // const brevMal = 'innvilgetVedtakMVP';

    // const datasett = 'ef-brev';
    const datasett = 'testdata';

    useEffect(() => {
        axiosRequest<BrevStruktur, null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
        }).then((respons: Ressurs<BrevStruktur>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settAlleFlettefelter(
                    respons.data.flettefelter.flettefeltReferanse.map((felt) => ({
                        _ref: felt._id,
                        verdi: null,
                    }))
                );
                settBrevStruktur(respons);
            }
        });
    }, []);

    const lagFlettefelterForDelmal = (delmalflettefelter: Flettefelter[]) => {
        return delmalflettefelter.reduce((acc, flettefeltAvsnitt) => {
            const nyttAvsnitt = lagFlettefeltForAvsnitt(flettefeltAvsnitt.flettefelt);
            return { ...acc, ...nyttAvsnitt };
        }, {});
    };

    const lagValgfelterForDelmal = (delmalValgfelter: ValgFelt[]) => {
        return delmalValgfelter.reduce((acc, valgfelt) => {
            const valgtMulighet = valgteFelt[valgfelt.valgFeltApiNavn];
            const flettefelterForValg = lagFlettefeltForAvsnitt(
                valgtMulighet.flettefelter.flatMap((felter) => felter.flettefelt)
            );
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
        if (brevStruktur.status === RessursStatus.SUKSESS) {
            return flettefelter.reduce((acc, flettefeltreferanse) => {
                const nyttFeltNavn = finnFlettefeltNavnFraRef(
                    brevStruktur.data,
                    flettefeltreferanse._ref
                );
                const nyttFeltVerdi = alleFlettefelter.find(
                    (flettefelt) => flettefeltreferanse._ref === flettefelt._ref
                )!.verdi;
                return { ...acc, [nyttFeltNavn]: [nyttFeltVerdi] };
            }, {});
        }
    };

    const genererBrev = () => {
        const delmaler =
            brevStruktur.status === RessursStatus.SUKSESS
                ? brevStruktur.data.dokument.delmaler.reduce((acc, delmal) => {
                      return valgteDelmaler[delmal.delmalApiNavn]
                          ? {
                                ...acc,
                                [delmal.delmalApiNavn]: [
                                    {
                                        flettefelter: lagFlettefelterForDelmal(
                                            delmal.delmalFlettefelter
                                        ),
                                        valgfelter: lagValgfelterForDelmal(delmal.delmalValgfelt),
                                    },
                                ],
                            }
                          : acc;
                  }, {})
                : {};

        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}/v2`,
            data: {
                valgfelter: {},
                delmaler,
                flettefelter: {
                    navn: ['$navn'],
                    fodselsnummer: ['$ident'],
                    'Fom-dato innvilgelse': ['$innvilgelseFra'],
                    'Tom-dato innvilgelse': ['$innvilgelseTil'],
                    begrunnelseFomDatoInnvilgelse: ['$begrunnelseFomDatoInnvilgelse'],
                    dato: ['$brevdato'],
                    belopOvergangsstonad: ['$belopOvergangsstonad'],
                },
            },
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    return (
        <DataViewer response={{ brevStruktur }}>
            {({ brevStruktur }) => (
                <>
                    {brevStruktur.dokument.delmaler.map((delmal) => (
                        <BrevMenyDelmal
                            delmal={delmal}
                            dokument={brevStruktur}
                            valgteFelt={valgteFelt}
                            settValgteFelt={settValgteFelt}
                            flettefelter={alleFlettefelter}
                            settFlettefelter={settAlleFlettefelter}
                            settValgteDelmaler={settValgteDelmaler}
                            key={delmal.delmalApiNavn}
                        />
                    ))}
                    <GenererBrev onClick={genererBrev}>Generer brev2!!!</GenererBrev>
                </>
            )}
        </DataViewer>
    );
};

export default Brevmeny;
