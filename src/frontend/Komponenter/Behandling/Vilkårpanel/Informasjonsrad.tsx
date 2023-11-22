import * as React from 'react';
import { Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { FC, ReactNode } from 'react';
import { mapIkon, VilkårInfoIkon } from './VilkårInformasjonKomponenter';

interface Props {
    ikon?: VilkårInfoIkon;
    label: string;
    verdi?: ReactNode;
    verdiSomString?: boolean;
    boldLabel?: boolean;
}

const InformasjonsradContainer = styled.div<{ $harVerdi: boolean }>`
    display: grid;
    grid-template-columns: 21px min(200px, 250px) auto;
    grid-gap: 0.5rem;

    .label {
        grid-column: 2 ${(props) => !props.$harVerdi && '/ 4'};
    }
`;

const Informasjonsrad: FC<Props> = ({
    ikon,
    label,
    verdi,
    verdiSomString = true,
    boldLabel = true,
}) => {
    return (
        <InformasjonsradContainer $harVerdi={!!verdi}>
            {ikon && mapIkon(ikon)}
            {boldLabel ? (
                <Label size="small" as="h3" className="label">
                    {label}
                </Label>
            ) : (
                <BodyShortSmall className="label">{label}</BodyShortSmall>
            )}
            {verdiSomString ? <BodyShortSmall>{verdi}</BodyShortSmall> : verdi}
        </InformasjonsradContainer>
    );
};

export default Informasjonsrad;
