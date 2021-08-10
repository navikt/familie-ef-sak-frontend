import React, { FC } from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    harSammeAdresseSøknad?: boolean;
    harSammeAdresseRegister?: boolean;
    erBarnetFødt: boolean;
}

const Bosted: FC<Props> = ({ harSammeAdresseSøknad, harSammeAdresseRegister, erBarnetFødt }) => {
    return (
        <>
            {harSammeAdresseRegister !== undefined && harSammeAdresseRegister !== null ? (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Bosted</Normaltekst>
                    <Normaltekst>
                        {harSammeAdresseRegister
                            ? 'Registrert på søkers adresse'
                            : 'Ikke registrert på søkers adresse'}
                    </Normaltekst>
                </>
            ) : (
                harSammeAdresseSøknad !== undefined &&
                harSammeAdresseSøknad !== null && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Bosted</Normaltekst>
                        <Normaltekst>
                            {utledVisningAvBostedVerdier(erBarnetFødt, harSammeAdresseSøknad)}
                        </Normaltekst>
                    </>
                )
            )}
        </>
    );
};

const utledVisningAvBostedVerdier = (erBarnetFødt: boolean, harSammeAdresse: boolean) => {
    if (harSammeAdresse) {
        return erBarnetFødt ? 'Bor hos søker' : 'Skal bo hos søker';
    }
    return erBarnetFødt ? 'Bor ikke hos søker' : 'Skal ikke bo hos søker';
};

export default Bosted;
