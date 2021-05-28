import React, { Dispatch, useEffect, useState } from 'react';
import {
    BrevStruktur,
    Flettefelter,
    FlettefeltMedVerdi,
    Flettefeltreferanse,
    ValgFelt,
    ValgtFelt,
} from './BrevTyper';
import { Systemtittel } from 'nav-frontend-typografi';
import { BrevMenyDelmal } from './BrevMenyDelmal';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { RessursStatus } from '@navikt/familie-typer';
import { finnFlettefeltNavnFraRef } from './BrevUtils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { IPersonopplysninger } from '../../../typer/personopplysninger';
import { dagensDatoFormatert } from '../../../utils/formatter';
import Panel from 'nav-frontend-paneler';

interface Props {
    settBrevRessurs: Dispatch<Ressurs<string>>;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}

const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const StyledBrevMeny = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const BrevMenyTittel = styled(Systemtittel)`
    margin-bottom: 0.5rem;
`;

const BrevMenyDelmalWrapper = styled.div`
    margin-top: 1rem;
`;

const groupBy = (array: any, key: string) => {
    return array.reduce((result: any, currentItem: any) => {
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        return result;
    }, {});
};

const Brevmeny: React.FC<Props> = ({ settBrevRessurs, behandlingId, personopplysninger }) => {
    const { axiosRequest } = useApp();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>([]);
    const [valgteFelt, settValgteFelt] = useState<ValgtFelt>({});
    const [valgteDelmaler, settValgteDelmaler] = useState<{ [delmalNavn: string]: boolean }>({});

    const brevMal = 'innvilgetOvergangsstonadHoved2';
    const datasett = 'ef-brev';

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
                ? brevStruktur.data.dokument.delmalerSortert.reduce((acc, delmal) => {
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
            url: `/familie-ef-sak/api/brev/${behandlingId}/${brevMal}`,
            data: {
                valgfelter: {},
                delmaler,
                flettefelter: {
                    navn: [personopplysninger.navn.visningsnavn],
                    fodselsnummer: [personopplysninger.personIdent],
                    dato: [dagensDatoFormatert()],
                },
            },
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    return (
        <DataViewer response={{ brevStruktur }}>
            {({ brevStruktur }) => {
                const delmalerGruppert = groupBy(brevStruktur.dokument.delmalerSortert, 'mappe');

                return (
                    <StyledBrevMeny>
                        {Object.entries(delmalerGruppert).map(
                            ([key, delmaler]: [string, any], index: number) => {
                                return (
                                    <Panel>
                                        <BrevMenyTittel>
                                            {key !== 'undefined' ? key : 'Ingen tittel'}
                                        </BrevMenyTittel>
                                        {delmaler.map((delmal: any) => {
                                            return (
                                                <BrevMenyDelmalWrapper>
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
                                                </BrevMenyDelmalWrapper>
                                            );
                                        })}
                                    </Panel>
                                );
                            }
                        )}
                        <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                    </StyledBrevMeny>
                );
            }}
        </DataViewer>
    );
};

export default Brevmeny;
