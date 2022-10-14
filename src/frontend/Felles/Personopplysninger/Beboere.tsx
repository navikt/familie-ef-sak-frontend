import React, { useCallback, useEffect, useState } from 'react';
import { ISøkeresultatPerson } from '../../App/typer/personopplysninger';
import { useApp } from '../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursStatus } from '../../App/typer/ressurs';
import DataViewer from '../DataViewer/DataViewer';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import SystemetLaster from '../SystemetLaster/SystemetLaster';

const StyledModalTabellWrapper = styled(TabellWrapper)`
    margin-bottom: 1rem;
    grid-template-columns: max-content;
`;

const Beboere: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    const søkPerson = useCallback(
        (fagsakPersonId: string) => {
            axiosRequest<ISøkeresultatPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/sok/fagsak-person/${fagsakPersonId}/samme-adresse`,
            }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
                settSøkResultat(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        søkPerson(fagsakPersonId);
    }, [fagsakPersonId, søkPerson]);

    return (
        <>
            {søkResultat.status === RessursStatus.IKKE_HENTET && <SystemetLaster />}
            <DataViewer response={{ søkResultat }}>
                {({ søkResultat }) => {
                    return (
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
                    );
                }}
            </DataViewer>
        </>
    );
};

export default Beboere;
