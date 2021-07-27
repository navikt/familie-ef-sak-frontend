import React, { useCallback, useEffect, useState } from 'react';
import { ISøkeresultatPerson } from '../../typer/personopplysninger';
import { useApp } from '../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursStatus } from '../../typer/ressurs';
import DataViewer from '../DataViewer/DataViewer';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import { useBehandling } from '../../context/BehandlingContext';

const StyledModalTabellWrapper = styled(TabellWrapper)`
    padding-top: 0rem;
    grid-template-columns: max-content;
`;

const Beboere: React.FC = () => {
    const { axiosRequest } = useApp();
    const { behandling } = useBehandling();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    const sokPerson = useCallback(
        (behandlingId: string) => {
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/${behandlingId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
                settSøkResultat(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            sokPerson(behandling.data.id);
        }
    }, [behandling, sokPerson]);

    return (
        <DataViewer response={{ søkResultat }}>
            {({ søkResultat }) => {
                return (
                    <>
                        <StyledModalTabellWrapper>
                            <table className="tabell">
                                <KolonneTitler titler={['Navn', 'Fødselsnummer', 'Adresse']} />
                                <tbody>
                                    {søkResultat.hits.map((beboer, indeks) => {
                                        return (
                                            <tr key={indeks}>
                                                <BredTd>{beboer.visningsnavn}</BredTd>
                                                <BredTd>{beboer.personIdent}</BredTd>
                                                <BredTd>{beboer.visningsadresse}</BredTd>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </StyledModalTabellWrapper>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Beboere;
