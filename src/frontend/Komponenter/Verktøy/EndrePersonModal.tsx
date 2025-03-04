import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { Button } from '@navikt/ds-react';
import { SøkPersonTODO } from './SøkPersonTODO';
import { ValgtPerson } from './ValgtPerson';
import { FinnNavnHer } from './SamværskalkulatorSide';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 100fr 1fr 100fr;
    column-gap: 2rem;
`;
const Venstrekolonne = styled.div``;
const Høyrekolonne = styled.div``;

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;

    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

const HorisontalLinje = styled.div`
    height: 0;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

const VertikalLinje = styled.div`
    border-left: 2px solid #f3f3f3;
    width: 5px;
    margin-bottom: 1rem;
`;

export const EndrePersonModal: FC<{
    finnNavnHer: FinnNavnHer;
    settFinnNavnHer: React.Dispatch<React.SetStateAction<FinnNavnHer>>;
    settVisBrevmottakereModal: (verdi: boolean) => void;
}> = ({ finnNavnHer, settVisBrevmottakereModal, settFinnNavnHer }) => {
    const [valgtPerson, settValgtPerson] = useState<FinnNavnHer>(finnNavnHer);
    console.log(valgtPerson.navn);

    return (
        <ModalWrapper
            tittel={'Hvem skal motta brevet?'}
            visModal={true}
            onClose={() => {
                settVisBrevmottakereModal(false);
            }}
            maxWidth={70}
            ariaLabel={'Velg brevmottakere'}
        >
            <GridContainer>
                <Venstrekolonne>
                    <SøkPersonTODO valgtPerson={valgtPerson} settValgtPerson={settValgtPerson} />
                    <HorisontalLinje />
                </Venstrekolonne>
                <VertikalLinje />
                <Høyrekolonne>
                    <ValgtPerson valgtPerson={valgtPerson} settValgtPerson={settValgtPerson} />
                </Høyrekolonne>
            </GridContainer>
            <SentrerKnapper>
                <Button variant="tertiary" onClick={() => settVisBrevmottakereModal(false)}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={() => settFinnNavnHer(valgtPerson)}>
                    Sett mottakere
                </Button>
            </SentrerKnapper>
        </ModalWrapper>
    );
};
