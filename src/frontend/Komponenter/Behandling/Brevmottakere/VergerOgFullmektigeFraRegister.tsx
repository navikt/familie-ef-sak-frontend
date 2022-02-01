import React, { Dispatch, FC, SetStateAction } from 'react';
import { Ingress, Normaltekst } from 'nav-frontend-typografi';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { IBrevmottaker } from './typer';
import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { Button } from '@navikt/ds-react';
import '@navikt/ds-css';

interface Props {
    valgteMottakere: IBrevmottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
}

const StyledIngress = styled(Ingress)`
    margin-bottom: 1rem;
`;

const Linje = styled.div`
    height: 0px;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Kolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

const ButtonContainer = styled.div`
    display: flex;
`;

const StyledButton = styled(Button)``;

export const VergerOgFullmektigeFraRegister: FC<Props> = ({
    valgteMottakere,
    settValgteMottakere,
    verger,
    fullmakter,
}) => {
    const muligeMottakere = [
        ...verger.map(vergemålTilBrevmottaker),
        ...fullmakter.map(fullmaktTilBrevMottaker),
    ];

    const settMottaker = (mottaker: IBrevmottaker) => () => {
        if (
            valgteMottakere.find(
                (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
            )
        )
            return;

        settValgteMottakere((prevState) => {
            const nyState = [...prevState, mottaker];

            return nyState;
        });
    };

    return (
        <>
            <StyledIngress>Verge/Fullmektig fra register</StyledIngress>
            {muligeMottakere.length ? (
                muligeMottakere.map((mottaker) => {
                    const mottakerValgt = !!valgteMottakere.find(
                        (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
                    );
                    return (
                        <>
                            <StyledMottakerBoks>
                                <Kolonner>
                                    {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={mottaker.personIdent}
                                    />
                                </Kolonner>
                                {!mottakerValgt && (
                                    <ButtonContainer>
                                        <StyledButton
                                            variant="secondary"
                                            size="medium"
                                            onClick={settMottaker(mottaker)}
                                        >
                                            Legg til
                                        </StyledButton>
                                    </ButtonContainer>
                                )}
                            </StyledMottakerBoks>
                        </>
                    );
                })
            ) : (
                <Normaltekst>Ingen verge/fullmektig i register</Normaltekst>
            )}
            <Linje />
        </>
    );
};
