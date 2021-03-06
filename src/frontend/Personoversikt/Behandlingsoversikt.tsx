import React, { useEffect, useState } from 'react';
import { Behandling, Fagsak } from '../typer/fagsak';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../utils/formatter';
import { formatterEnumVerdi } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useSorteringState } from '../hooks/felles/useSorteringState';
import SorteringsHeader from '../Oppgavebenk/OppgaveSorteringHeader';
import { Behandlingstype } from '../typer/behandlingstype';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { PartialRecord } from '../typer/common';
import { ToggleName } from '../context/toggles';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useToggles } from '../context/TogglesContext';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const TekniskOpphørKnapp = styled(Knapp)`
    margin: 1rem;
`;

const Behandlingsoversikt: React.FC<{ fagsakId: string; personIdent: string }> = ({
    fagsakId,
    personIdent,
}) => {
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();

    const hentFagsak = () =>
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then((response) => settFagsak(response));

    const gjørTekniskOpphør = (personIdent: string) => {
        axiosRequest<Ressurs<void>, { ident: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor`,
            data: { ident: personIdent },
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentFagsak();
            } else if (
                response.status === RessursStatus.FEILET ||
                response.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    useEffect(() => {
        if (fagsakId) {
            hentFagsak();
        }
        // eslint-disable-next-line
    }, [fagsakId]);

    return (
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => (
                <>
                    <Systemtittel tag="h3">
                        Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
                    </Systemtittel>
                    <BehandlingsoversiktTabell behandlinger={fagsak.behandlinger} />
                    {toggles[ToggleName.TEKNISK_OPPHØR] && (
                        <TekniskOpphørKnapp onClick={() => gjørTekniskOpphør(personIdent)}>
                            Teknisk opphør
                        </TekniskOpphørKnapp>
                    )}
                    {tekniskOpphørFeilet && (
                        <AlertStripeFeil style={{ maxWidth: '15rem' }}>
                            Kunde inte iverksetta teknisk opphør. Ta venligest kontakt med noen som
                            som har tilgang til secureloggs och kan førtelle dig hva som gikk galt
                        </AlertStripeFeil>
                    )}
                </>
            )}
        </DataViewer>
    );
};

const TabellData: PartialRecord<keyof Behandling, string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    status: 'Status',
    resultat: 'Resultat',
};

const BehandlingsoversiktTabell: React.FC<Pick<Fagsak, 'behandlinger'>> = ({ behandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState<Behandling>(
        behandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'ascending',
        }
    );

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([felt, tekst]) => (
                        <SorteringsHeader
                            rekkefolge={
                                sortConfig?.sorteringsfelt === felt
                                    ? sortConfig?.rekkefolge
                                    : undefined
                            }
                            tekst={tekst}
                            onClick={() => settSortering(felt as keyof Behandling)}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortertListe.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDatoTid(behandling.opprettet)}</td>
                            <td>{formatterEnumVerdi(behandling.type)}</td>
                            <td>{formatterEnumVerdi(behandling.status)}</td>
                            <td>
                                {behandling.type === Behandlingstype.TEKNISK_OPPHØR ? (
                                    <span>{formatterEnumVerdi(behandling.resultat)}</span>
                                ) : (
                                    <Link
                                        className="lenke"
                                        to={{ pathname: `/behandling/${behandling.id}` }}
                                    >
                                        {formatterEnumVerdi(behandling.resultat)}
                                    </Link>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default Behandlingsoversikt;
