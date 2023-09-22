import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import { BodyShort, Popover } from '@navikt/ds-react';
import styled from 'styled-components';
import { Information } from '@navikt/ds-icons';
import { popoverContentDeltBosted } from './BarnDeltBosted';

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const InformationIcon = styled(Information)`
    &:hover {
        cursor: pointer;
    }
`;

const bostedStatus = (barn: IBarn) => {
    if (barn.harDeltBostedNå) {
        return 'Delt bosted';
    }
    if (barn.borHosSøker) {
        return 'Ja';
    }
    return '-'; // TODO : "Nei" vs "-" ?
};

const BarnBosted: React.FC<{ barn: IBarn }> = ({ barn }) => {
    const iconRef = useRef<SVGSVGElement>(null);
    const [openState, setOpenState] = useState(false);

    return (
        <FlexBox>
            <BodyShort size="small">{bostedStatus(barn)}</BodyShort>
            {barn.deltBosted.length > 0 && (
                <InformationIcon ref={iconRef} onClick={() => setOpenState(true)}>
                    Åpne popover
                </InformationIcon>
            )}
            <Popover
                placement={'right'}
                open={openState}
                onClose={() => setOpenState(false)}
                anchorEl={iconRef.current}
                children={popoverContentDeltBosted(barn.deltBosted)}
            />
        </FlexBox>
    );
};

export default BarnBosted;
