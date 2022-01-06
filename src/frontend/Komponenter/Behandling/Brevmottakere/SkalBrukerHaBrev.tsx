import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';

interface Props {
    valgteBrevmottakere: IBrevmottaker[];
    settValgtBrevMottakere: Dispatch<SetStateAction<IBrevmottaker[]>>;
    personopplysninger: IPersonopplysninger;
}
export const SkalBrukerHaBrev: FC<Props> = ({
    valgteBrevmottakere,
    settValgtBrevMottakere,
    personopplysninger,
}) => {
    const skalIntieltVæreAvkrysset = !!valgteBrevmottakere.find(
        (mottaker) => mottaker.mottakerRolle === EBrevmottakerRolle.BRUKER
    );
    const [brukerSkalHaBrev, settBrukerSkalHaBrev] = useState<boolean>(skalIntieltVæreAvkrysset);

    useEffect(() => {
        function leggTilBrukerIBrevmottakere() {
            settValgtBrevMottakere((prevState) => [
                ...prevState,
                {
                    mottakerRolle: EBrevmottakerRolle.BRUKER,
                    personIdent: personopplysninger.personIdent,
                    navn: personopplysninger.navn.visningsnavn,
                },
            ]);
        }

        function fjernBrukerFraBrevmottakere() {
            settValgtBrevMottakere((prevState) =>
                prevState.filter((mottaker) => mottaker.mottakerRolle !== EBrevmottakerRolle.BRUKER)
            );
        }

        if (brukerSkalHaBrev) {
            leggTilBrukerIBrevmottakere();
        } else {
            fjernBrukerFraBrevmottakere();
        }
    }, [
        brukerSkalHaBrev,
        personopplysninger.navn.visningsnavn,
        personopplysninger.personIdent,
        settValgtBrevMottakere,
    ]);

    return (
        <>
            <Ingress>Skal bruker motta brevet?</Ingress>
            <RadioGruppe>
                <Radio
                    label={'Ja'}
                    name={'brukerHaBrevRadio'}
                    checked={brukerSkalHaBrev}
                    onChange={() => settBrukerSkalHaBrev(true)}
                />
                <Radio
                    label={'Nei'}
                    name={'brukerHaBrevRadio'}
                    checked={!brukerSkalHaBrev}
                    onChange={() => settBrukerSkalHaBrev(false)}
                />
            </RadioGruppe>
        </>
    );
};
