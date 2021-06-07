/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import React, { Dispatch, useEffect, useState } from 'react';
import {
    BrevStruktur,
    Delmal,
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
import { finnFlettefeltNavnFraRef, grupperDelmaler } from './BrevUtils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { IPersonopplysninger } from '../../../typer/personopplysninger';
import { dagensDatoFormatert } from '../../../utils/formatter';
import Panel from 'nav-frontend-paneler';

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

interface Props {
    settBrevRessurs: Dispatch<Ressurs<string>>;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
}

const brevMal = 'innvilgetOvergangsstonadHoved2';
const datasett = 'ef-brev';

const initFlettefelterMedVerdi = (brevStruktur: BrevStruktur): FlettefeltMedVerdi[] =>
    brevStruktur.flettefelter.flettefeltReferanse.map((felt) => ({
        _ref: felt._id,
        verdi: null,
    }));

const Brevmeny: React.FC<Props> = (props) => {
    const { axiosRequest } = useApp();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());

    useEffect(() => {
        axiosRequest<BrevStruktur, null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
        }).then((respons: Ressurs<BrevStruktur>) => {
            settBrevStruktur(respons);
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur }}>
            {({ brevStruktur }) => <BrevmenyView {...props} brevStruktur={brevStruktur} />}
        </DataViewer>
    );
};

const BrevmenyView: React.FC<Props & { brevStruktur: BrevStruktur }> = ({
    settBrevRessurs,
    behandlingId,
    personopplysninger,
    settKanSendesTilBeslutter,
    brevStruktur,
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
            const nyttFeltNavn = finnFlettefeltNavnFraRef(brevStruktur, flettefeltreferanse._ref);
            const nyttFeltVerdi = alleFlettefelter.find(
                (flettefelt) => flettefeltreferanse._ref === flettefelt._ref
            )!.verdi;
            return { ...acc, [nyttFeltNavn]: [nyttFeltVerdi] };
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
                          },
                      ],
                  }
                : acc;
        }, {});
    };

    const genererBrev = () => {
        axiosRequest<string, any>({
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
            settBrevRessurs(respons);
            if (respons.status === RessursStatus.SUKSESS) {
                settKanSendesTilBeslutter(true);
            }
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

export default Brevmeny;
