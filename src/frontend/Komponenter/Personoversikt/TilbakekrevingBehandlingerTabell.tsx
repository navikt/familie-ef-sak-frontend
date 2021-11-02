import React from 'react';
import { TilbakekrevingBehandling } from '../../App/typer/tilbakekreving';
import styled from 'styled-components';
import { formaterIsoDatoTid, formaterNullableIsoDato } from '../../App/utils/formatter';

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

export const TilbakekrevingBehandlingerTabell: React.FC<{
    tilbakekrevingBehandlinger: TilbakekrevingBehandling[];
}> = ({ tilbakekrevingBehandlinger }) => {
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
                                <td>{tilbakekreving.type}</td>
                                <td>{tilbakekreving.status}</td>
                                <td>{formaterNullableIsoDato(tilbakekreving.vedtaksdato)}</td>
                                <td>{tilbakekreving.resultat}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </>
    );
};
