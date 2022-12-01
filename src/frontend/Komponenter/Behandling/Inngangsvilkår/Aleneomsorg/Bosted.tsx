import React, { FC } from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

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
                    <BodyShortSmall>Bosted</BodyShortSmall>
                    <BodyShortSmall>
                        {harSammeAdresseRegister
                            ? 'Registrert på søkers adresse'
                            : 'Ikke registrert på søkers adresse'}
                    </BodyShortSmall>
                </>
            ) : (
                harSammeAdresseSøknad !== undefined &&
                harSammeAdresseSøknad !== null && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Bosted</BodyShortSmall>
                        <BodyShortSmall>
                            {utledVisningAvBostedVerdier(erBarnetFødt, harSammeAdresseSøknad)}
                        </BodyShortSmall>
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
