import React, { FC } from 'react';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    harSammeAdresseSøknad?: boolean;
    harSammeAdresseRegister?: boolean;
    erBarnetFødt: boolean;
}

const Bosted: FC<Props> = ({ harSammeAdresseSøknad, harSammeAdresseRegister, erBarnetFødt }) => {
    return (
        <>
            {harSammeAdresseRegister !== undefined && harSammeAdresseRegister !== null ? (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Bosted"
                    verdi={
                        harSammeAdresseRegister
                            ? 'Registrert på søkers adresse'
                            : 'Ikke registrert på søkers adresse'
                    }
                />
            ) : (
                harSammeAdresseSøknad !== undefined &&
                harSammeAdresseSøknad !== null && (
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Bosted"
                        verdi={utledVisningAvBostedVerdier(erBarnetFødt, harSammeAdresseSøknad)}
                    />
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
