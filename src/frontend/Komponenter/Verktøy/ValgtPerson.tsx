import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import FjernKnapp from '../../Felles/Knapper/FjernKnapp';
import { BodyShort, Ingress } from '@navikt/ds-react';
import { FinnNavnHer } from './SamværskalkulatorSide';

interface Props {
    valgtPerson: FinnNavnHer;
    settValgtPerson: Dispatch<SetStateAction<FinnNavnHer>>;
}

const Undertittel = styled(Ingress)`
    margin-bottom: 1rem;
`;

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Flexboks = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ValgtPerson: FC<Props> = ({ valgtPerson, settValgtPerson }) => {
    const fjernPersonMottaker = () => () => {
        settValgtPerson({ personIdent: '', navn: '' });
    };
    return (
        <>
            <Undertittel>Brevmottakere</Undertittel>
            <StyledMottakerBoks key={valgtPerson.personIdent}>
                <Flexboks>
                    <BodyShort>
                        {valgtPerson.navn}
                        <KopierbartNullableFødselsnummer fødselsnummer={valgtPerson.personIdent} />
                    </BodyShort>
                </Flexboks>
                <FjernKnapp
                    onClick={fjernPersonMottaker()}
                    ikontekst={'Fjern person fra mottakerliste'}
                />
            </StyledMottakerBoks>
        </>
    );
};
