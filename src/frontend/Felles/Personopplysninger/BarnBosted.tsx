import React, { useRef, useState } from 'react';
import { IBarn } from '../../App/typer/personopplysninger';
import { BodyShort, HStack, Popover, Button } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { popoverContentDeltBosted } from './BarnDeltBosted';

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
        <HStack gap="2" align="center">
            <BodyShort size="small">{bostedStatus(barn)}</BodyShort>
            {barn.deltBosted.length > 0 && (
                <Button
                    onClick={() => setOpenState(true)}
                    size="small"
                    variant="tertiary"
                    iconPosition="right"
                    aria-label="Vis dato-informasjon om delt bosted"
                    icon={<InformationSquareIcon ref={iconRef} />}
                />
            )}
            <Popover
                placement={'right'}
                open={openState}
                onClose={() => setOpenState(false)}
                anchorEl={iconRef.current}
            >
                {popoverContentDeltBosted(barn.deltBosted)}
            </Popover>
        </HStack>
    );
};

export default BarnBosted;
