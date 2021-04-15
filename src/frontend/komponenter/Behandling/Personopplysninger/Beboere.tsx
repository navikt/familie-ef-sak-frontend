import React, { useEffect, useState } from 'react';
import { IAdresse, IBostedsadresse, ISøkeresultatPerson } from '../../../typer/personopplysninger';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet } from '../../../typer/ressurs';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { BredTd, KolonneTitler, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';

const StyledModalTabellWrapper = styled(TabellWrapper)`
    padding-top: 0rem;
    grid-template-columns: max-content;
`;

const Beboere: React.FC<{ adresse: IAdresse }> = ({ adresse }) => {
    const { axiosRequest } = useApp();
    const [søkResultat, settSøkResultat] = useState<Ressurs<ISøkeresultatPerson>>(byggTomRessurs());

    useEffect(() => {
        sokPerson();
    }, []);

    const sokPerson = () => {
        axiosRequest<ISøkeresultatPerson, IBostedsadresse>({
            method: 'POST',
            url: `/familie-ef-sak/api/sok/person/samme-adresse`,
            data: adresse.bostedsadresse,
        }).then((respons: Ressurs<ISøkeresultatPerson> | RessursFeilet) => {
            settSøkResultat(respons);
        });
    };

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
