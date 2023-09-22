import React, { FC, useRef, useState } from 'react';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IDeltBostedPeriode } from '../../../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Popover } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { popoverContentDeltBosted } from '../../../../Felles/Personopplysninger/BarnDeltBosted';

interface Props {
    harSammeAdresseSøknad?: boolean;
    harSammeAdresseRegister?: boolean;
    erBarnetFødt: boolean;
    deltBostedPerioder: IDeltBostedPeriode[];
    harDeltBostedVedGrunnlagsdataopprettelse: boolean;
}

const FlexBox = styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
`;

const InformationIcon = styled(InformationSquareIcon)`
    &:hover {
        cursor: pointer;
    }
`;
export const StyledDiv = styled.div`
    margin-right: 1rem;
`;
const utledBostedTekst = (harDeltBosted: boolean, harSammeAdresse: boolean | undefined) => {
    if (harDeltBosted) {
        return 'Registrert med delt bosted';
    }
    if (harSammeAdresse) {
        return 'Registrert på brukers adresse';
    }
    return 'Ikke registrert på brukers adresse';
};
const Bosted: FC<Props> = ({
    harSammeAdresseSøknad,
    harSammeAdresseRegister,
    erBarnetFødt,
    deltBostedPerioder,
    harDeltBostedVedGrunnlagsdataopprettelse,
}) => {
    const iconRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);
    return (
        <>
            {(harSammeAdresseRegister !== undefined && harSammeAdresseRegister !== null) ||
            harDeltBostedVedGrunnlagsdataopprettelse ? (
                <FlexBox>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.REGISTER}
                        label="Bosted"
                        verdi={utledBostedTekst(
                            harDeltBostedVedGrunnlagsdataopprettelse,
                            harSammeAdresseRegister
                        )}
                    />
                    {deltBostedPerioder.length > 0 && (
                        <>
                            <InformationIcon ref={iconRef} onClick={() => setOpenState(true)}>
                                Åpne popover
                            </InformationIcon>
                            <Popover
                                placement={'right'}
                                open={openState}
                                onClose={() => setOpenState(false)}
                                anchorEl={iconRef.current}
                                children={popoverContentDeltBosted(deltBostedPerioder)}
                            />
                        </>
                    )}
                </FlexBox>
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
