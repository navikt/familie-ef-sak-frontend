import { BodyShort, Label, RadioGroup, Radio } from '@navikt/ds-react';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { BarnForRevurdering } from '../../App/typer/revurderingstype';
import { datoTilAlder } from '../../App/utils/dato';
import { EVilkårsbehandleBarnValg } from '../../App/typer/vilkårsbehandleBarnValg';

const StyledNyeBarn = styled.div`
    margin-top: 2rem;
`;

const StyledRadioGroup = styled(RadioGroup)`
    margin-top: 2rem;
`;

interface IProps {
    nyeBarnSidenForrigeBehandling: BarnForRevurdering[];
    måTaStillingTilBarn: boolean;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    settVilkårsbehandleNyeBarn: Dispatch<SetStateAction<EVilkårsbehandleBarnValg>>;
}

export const NyeBarn = ({
    nyeBarnSidenForrigeBehandling,
    måTaStillingTilBarn,
    vilkårsbehandleNyeBarn,
    settVilkårsbehandleNyeBarn,
}: IProps) => {
    if (måTaStillingTilBarn)
        return (
            <StyledNyeBarn>
                <Label>Barn som ikke tidligere er behandlet</Label>
                <BodyShort>
                    Da dette er en migrert sak er brukerens barn ikke tidligere vilkårsbehandlet i
                    EF Sak. Vurder om det er behov for å vilkårsbehandle barna i EF Sak, eller om
                    det holder å vise til tidligere vurdering i Gosys. Merk at om brukerens barn
                    ikke skal vilkårsbehandles i EF Sak vil de heller ikke vises i behandlingen.
                </BodyShort>
                <ul>
                    {nyeBarnSidenForrigeBehandling?.map((nyttBarn) => {
                        return (
                            <li key={nyttBarn.personIdent}>
                                {nyttBarn.navn} ({datoTilAlder(nyttBarn.fødselsdato)} år,{' '}
                                {nyttBarn.personIdent})
                            </li>
                        );
                    })}
                </ul>
                <StyledRadioGroup
                    legend=""
                    size="medium"
                    value={vilkårsbehandleNyeBarn}
                    onChange={(val) => settVilkårsbehandleNyeBarn(val)}
                >
                    <Radio value={EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE}>
                        Vilkårsbehandle barn i EF Sak
                    </Radio>
                    <Radio value={EVilkårsbehandleBarnValg.IKKE_VILKÅRSBEHANDLE}>
                        Ikke vilkårsbehandle barn i EF Sak
                    </Radio>
                </StyledRadioGroup>
            </StyledNyeBarn>
        );
    else {
        return (
            <StyledNyeBarn>
                <Label>Barn som ikke tidligere er behandlet</Label>
                <BodyShort>
                    Barna listet opp nedenfor har blitt lagt til i Folkeregisteret etter at saken
                    sist ble vurdert. De blir nå tatt med inn i behandlingen og saksbehandler må
                    vurdere om vilkårene skal vurderes på nytt.
                </BodyShort>
                <ul>
                    {nyeBarnSidenForrigeBehandling?.map((nyttBarn) => {
                        return (
                            <li>
                                {nyttBarn.navn} ({datoTilAlder(nyttBarn.fødselsdato)} år,{' '}
                                {nyttBarn.personIdent})
                            </li>
                        );
                    })}
                </ul>
            </StyledNyeBarn>
        );
    }
};
