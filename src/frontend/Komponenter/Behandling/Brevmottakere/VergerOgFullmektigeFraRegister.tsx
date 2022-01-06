import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { IBrevmottaker } from './typer';
import { fullmaktTilBrevMottaker, vergemålTilBrevmottaker } from './brevmottakerUtils';

interface Props {
    valgteMottakere: IBrevmottaker[];
    settValgteMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
}

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

    const toggleMottaker = (mottaker: IBrevmottaker) => (e: ChangeEvent<HTMLInputElement>) => {
        settValgteMottakere((prevState) => {
            return e.target.checked
                ? [...prevState, mottaker]
                : [
                      ...prevState.filter(
                          (valgtMottaker) => valgtMottaker.personIdent !== mottaker.personIdent
                      ),
                  ];
        });
    };
    return (
        <>
            <Ingress>Verge/Fullmektig fra register</Ingress>
            {muligeMottakere.map((mottaker, index) => {
                const mottakerValgt = !!valgteMottakere.find(
                    (valgtMottaker) => valgtMottaker.personIdent === mottaker.personIdent
                );
                return (
                    <Checkbox
                        key={index}
                        label={`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                        onChange={toggleMottaker(mottaker)}
                        checked={mottakerValgt}
                    />
                );
            })}
        </>
    );
};
