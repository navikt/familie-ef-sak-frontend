import React, { useCallback, useState } from 'react';
import { Button, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BreakWordBodyLongSmall } from '../../../Felles/Visningskomponenter/BreakWordBodyLongSmall';
import { ABlue300 } from '@navikt/ds-tokens/dist/tokens';

const EkspanderbarContainer = styled(BreakWordBodyLongSmall)<{ ekspandert: boolean }>`
    max-height: ${(props) => (props.ekspandert ? 'none' : '15rem')};
    overflow: hidden;
`;

const LeftBorder = styled.div`
    border-left: 2px solid ${ABlue300};
    padding-left: 0.75rem;
`;

export const EksisterendeBeskrivelse: React.FC<{ beskrivelse?: string }> = ({ beskrivelse }) => {
    const [harOverflow, settHarOverflow] = useState(false);
    const [ekspandert, settEkspandert] = useState(false);

    const refCallback: React.RefCallback<HTMLElement> = useCallback((ref) => {
        if (ref !== null) {
            settHarOverflow(ref.scrollHeight > ref.clientHeight);
        }
    }, []);

    return (
        <section>
            <Label size={'small'}>Beskrivelseshistorikk</Label>
            <LeftBorder>
                <EkspanderbarContainer ref={refCallback} ekspandert={ekspandert}>
                    {beskrivelse}
                </EkspanderbarContainer>
                {(harOverflow || ekspandert) && (
                    <Button
                        variant={'tertiary'}
                        icon={ekspandert ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        iconPosition={'right'}
                        type={'button'}
                        onClick={() => settEkspandert((prevstate) => !prevstate)}
                    >
                        {ekspandert ? 'Skjul beskrivelsen' : 'Se hele beskrivelsen'}
                    </Button>
                )}
            </LeftBorder>
        </section>
    );
};
