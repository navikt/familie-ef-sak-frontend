import React from 'react';
import styled from 'styled-components';
import { Button, Heading } from '@navikt/ds-react';
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
    fjernSkoleårsperiode: () => void;
    oppdaterVisningsmodus: () => void;
    skalViseFjernKnapp: boolean;
    skoleår: string;
    visningsmodus: Visningsmodus;
}

const SkoleårsperiodeHeader: React.FC<Props> = ({
    fjernSkoleårsperiode,
    oppdaterVisningsmodus,
    skalViseFjernKnapp,
    skoleår,
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
                {`Skoleår ${skoleår}`}
            </Heading>
            <FlexRow>
                {skalViseFjernKnapp && (
                    <Button
                        onClick={fjernSkoleårsperiode}
                        type={'button'}
                        variant={'tertiary'}
                        style={{ width: 'fit-content' }}
                    >
                        Fjern skoleårsperiode
                    </Button>
                )}
                {visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODER && (
                    <Button
                        icon={<PencilWritingIcon title={'endre skoleår'} />}
                        iconPosition={'right'}
                        onClick={oppdaterVisningsmodus}
                        type={'button'}
                        variant={'tertiary'}
                        style={{ width: 'fit-content' }}
                    >
                        Endre skoleår
                    </Button>
                )}
                {visningsmodus === Visningsmodus.REDIGER_SKOLEÅRSPERIODER && (
                    <Button
                        onClick={oppdaterVisningsmodus}
                        type={'button'}
                        variant={'tertiary'}
                        style={{ width: 'fit-content' }}
                    >
                        Lagre skoleår
                    </Button>
                )}
            </FlexRow>
        </FlexSpaceBetween>
    );
};

export default SkoleårsperiodeHeader;
