import React, { Dispatch, FC, SetStateAction } from 'react';
import { Ingress, Normaltekst } from 'nav-frontend-typografi';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { IBrevmottaker } from './typer';
import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';
import styled from 'styled-components';
import { KopierbartNullableFødselsnummer } from '../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { Button } from '@navikt/ds-react';
import '@navikt/ds-css';
import { VertikalSentrering } from '../../../App/utils/styling';

interface Props {
    valgteMottakere: IBrevmottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
}

const StyledIngress = styled(Ingress)`
    margin-bottom: 1rem;
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
                                    <VertikalSentrering>
                                        <div>
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={settMottaker(mottaker)}
                                            >
                                                Legg til
                                            </Button>
                                        </div>
                                    </VertikalSentrering>
                                )}
                            </StyledMottakerBoks>
                        </>
                    );
                })
            ) : (
                <Normaltekst>Ingen verge/fullmektig i register</Normaltekst>
            )}
        </>
    );
};
