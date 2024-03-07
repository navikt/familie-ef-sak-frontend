import * as React from 'react';
import { FC } from 'react';
import { IUtenlandsopphold } from './typer';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    utenlandsopphold: IUtenlandsopphold[];
}
const PeriodeStyling = styled(BodyShort)`
    font-weight: bold;
    font-size: var(--a-font-size-medium);
    text-decoration: underline;
    margin-left: 29px;
`;

const InformasjonsradStyling = styled.div`
    font-size: var(--a-font-size-medium);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const ikon = VilkårInfoIkon.SØKNAD;
const Utenlandsopphold: FC<Props> = ({ utenlandsopphold }) => (
    <>
        <Informasjonsrad ikon={ikon} label={'Utenlandsopphold'} />
        {utenlandsopphold.map((opphold) => (
            <>
                <PeriodeStyling>
                    Periode {opphold.fraDato} - {opphold.tilDato}
                </PeriodeStyling>
                <InformasjonsradStyling>
                    <Informasjonsrad label="Land" verdi={opphold.land} />
                    <Informasjonsrad label="ID-nummer" verdi={opphold.personidentUtland} />
                    <Informasjonsrad label="Adresse" verdi={opphold.adresseUtland} />
                    <Informasjonsrad label="Årsak" verdi={opphold.årsak} />
                </InformasjonsradStyling>
            </>
        ))}
    </>
);

export default Utenlandsopphold;
