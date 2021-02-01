import React, { FC } from 'react';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';

interface Props {
    harSammeAdresseSøknad?: boolean;
    harSammeAdresseRegister?: boolean;
}

const Bosted: FC<Props> = ({ harSammeAdresseSøknad, harSammeAdresseRegister }) => {
    return (
        <>
            {harSammeAdresseRegister !== undefined &&
            harSammeAdresseSøknad !== undefined &&
            harSammeAdresseRegister === harSammeAdresseSøknad ? (
                <>
                    <Søknadsgrunnlag /> <Registergrunnlag />
                    <Normaltekst>Bor med søker</Normaltekst>
                    <BooleanTekst value={harSammeAdresseRegister} />
                </>
            ) : (
                <>
                    {harSammeAdresseRegister !== undefined && (
                        <>
                            <Registergrunnlag />
                            <Normaltekst>Bor med søker</Normaltekst>
                            <BooleanTekst value={harSammeAdresseRegister} />
                        </>
                    )}

                    {harSammeAdresseSøknad !== undefined && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Bor med søker</Normaltekst>
                            <BooleanTekst value={harSammeAdresseSøknad} />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Bosted;
