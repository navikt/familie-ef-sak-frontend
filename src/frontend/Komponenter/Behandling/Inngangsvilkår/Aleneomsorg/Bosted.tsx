import React, { FC, useRef, useState } from 'react';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IDeltBostedPeriode } from '../../../../App/typer/personopplysninger';
import styled from 'styled-components';
import { BodyShort, Popover, Table } from '@navikt/ds-react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { Information } from '@navikt/ds-icons';

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

const InformationIcon = styled(Information)`
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
const historiskTekst = (historisk: boolean) => {
    if (historisk) {
        return 'Ja';
    }
    return 'Nei';
};
const popoverContent = (deltBostedPerioder: IDeltBostedPeriode[]) => (
    <Popover.Content>
        <BodyShort>Delt bosted:</BodyShort>
        <Table size={'small'}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Fra</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Til</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Historisk</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {deltBostedPerioder.map((deltBostedPeriode) => {
                    return (
                        <Table.Row key={deltBostedPeriode.startdatoForKontrakt}>
                            <Table.DataCell>
                                <StyledDiv>
                                    {formaterNullableIsoDato(
                                        deltBostedPeriode.startdatoForKontrakt
                                    )}
                                </StyledDiv>
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterNullableIsoDato(deltBostedPeriode.sluttdatoForKontrakt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {historiskTekst(deltBostedPeriode.historisk)}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    </Popover.Content>
);
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
                                children={popoverContent(deltBostedPerioder)}
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
