import React from 'react';
import styled from 'styled-components';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { Heading } from '@navikt/ds-react';
import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Visningsmodus } from './Skoleårsperiode';

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const FlexSpaceBetween = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: space-between;
`;

interface Props {
    oppdaterVisningsmodus: () => void;
    skalViseFjernKnapp: boolean;
    visningsmodus: Visningsmodus;
}

const SkoleårsperiodeHeader: React.FC<Props> = ({
    oppdaterVisningsmodus,
    skalViseFjernKnapp,
    visningsmodus,
}) => {
    if (visningsmodus === Visningsmodus.INITIELL) {
        return (
            <Heading size={'medium'} level={'2'}>
                Legg til skoleår
            </Heading>
        );
    }

    return (
        <FlexSpaceBetween>
            <Heading size={'medium'} level={'2'}>
                Skoleår 23/24
            </Heading>
            <FlexRow>
                {skalViseFjernKnapp && (
                    <Knapp onClick={() => null} type={'button'} variant={'tertiary'}>
                        Fjern skoleårsperiode
                    </Knapp>
                )}
                {visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODER ? (
                    <Knapp
                        icon={<PencilWritingIcon title={'endre skoleår'} />}
                        iconPosition={'right'}
                        onClick={oppdaterVisningsmodus}
                        type={'button'}
                        variant={'tertiary'}
                    >
                        Endre skoleår
                    </Knapp>
                ) : (
                    <Knapp onClick={oppdaterVisningsmodus} type={'button'} variant={'tertiary'}>
                        Lagre Skoleår
                    </Knapp>
                )}
            </FlexRow>
        </FlexSpaceBetween>
    );
};

export default SkoleårsperiodeHeader;
