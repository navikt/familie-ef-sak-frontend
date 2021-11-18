import React from 'react';
import {
    TilbakekrevingBehandling,
    tilbakekrevingBehandlingsresultattypeTilTekst,
    tilbakekrevingBehandlingsstatusTilTekst,
    tilbakekrevingBehandlingstypeTilTekst,
} from '../../App/typer/tilbakekreving';
import styled from 'styled-components';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../App/utils/formatter';
import { tilbakekrevingBaseUrl } from '../../App/utils/miljø';

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const lagTilbakekrevingslenke = (eksternFagsakId: number, behandlingId: string) => {
    return `${tilbakekrevingBaseUrl()}/fagsystem/EF/fagsak/${eksternFagsakId}/behandling/${behandlingId}`;
};

export const TilbakekrevingBehandlingerTabell: React.FC<{
    tilbakekrevingBehandlinger: TilbakekrevingBehandling[];
    eksternFagsakId: number;
}> = ({ tilbakekrevingBehandlinger, eksternFagsakId }) => {
    return (
        <>
            <h3>Fagsak: Tilbakekrevinger</h3>
            <StyledTable className="tabell">
                <thead>
                    <tr>
                        <td>Opprettet</td>
                        <td>Type</td>
                        <td>Status</td>
                        <td>Vedtaksdato</td>
                        <td>Resultat</td>
                    </tr>
                </thead>
                <tbody>
                    {tilbakekrevingBehandlinger.map((tilbakekreving) => {
                        return (
                            <tr key={tilbakekreving.behandlingId}>
                                <td>{formaterIsoDatoTid(tilbakekreving.opprettetTidspunkt)}</td>
                                <td>
                                    {tilbakekreving.type &&
                                        tilbakekrevingBehandlingstypeTilTekst[tilbakekreving.type]}
                                </td>
                                <td>
                                    {tilbakekrevingBehandlingsstatusTilTekst[tilbakekreving.status]}
                                </td>
                                <td>{formaterNullableIsoDato(tilbakekreving.vedtaksdato)}</td>
                                <td>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={lagTilbakekrevingslenke(
                                            eksternFagsakId,
                                            tilbakekreving.behandlingId
                                        )}
                                    >
                                        {tilbakekreving.resultat
                                            ? tilbakekrevingBehandlingsresultattypeTilTekst[
                                                  tilbakekreving.resultat
                                              ]
                                            : 'Ikke satt'}
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </>
    );
};
