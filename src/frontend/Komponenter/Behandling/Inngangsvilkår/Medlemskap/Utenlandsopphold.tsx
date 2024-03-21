import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from './typer';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import styled from 'styled-components';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    utenlandsopphold: IUtenlandsopphold[];
}

const PeriodeStyling = styled(BodyShort)`
    font-weight: bold;
    text-decoration: underline;
    padding-left: 2rem;
`;

const Grid = styled.div`
    font-size: var(--a-font-size-medium);
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 1rem;
    padding-left: 2rem;
`;

const ikon = VilkårInfoIkon.SØKNAD;
const Utenlandsopphold: FC<Props> = ({ utenlandsopphold }) => (
    <VStack gap="4">
        <Informasjonsrad ikon={ikon} label={'Utenlandsopphold'} />
        {utenlandsopphold.map((opphold) => (
            <>
                <PeriodeStyling>
                    Periode {opphold.fraDato} - {opphold.tilDato}
                </PeriodeStyling>
                <Grid>
                    <Label size="small">Land</Label>
                    <BodyShort size="small">{opphold.land}</BodyShort>
                    <Label size="small">ID-nummer</Label>
                    <BodyShort size="small">
                        {opphold.kanIkkeOppgiPersonIdent
                            ? 'Har ikke id-nummer i aktuelt land'
                            : opphold.personidentEøsLand}
                    </BodyShort>
                    <Label size="small">Adresse</Label>
                    <BodyShort size="small">{opphold.adresseEøsLand}</BodyShort>
                    <Label size="small">Årsak</Label>
                    <BodyShort size="small">{opphold.årsak}</BodyShort>
                </Grid>
            </>
        ))}
    </VStack>
);

export default Utenlandsopphold;
