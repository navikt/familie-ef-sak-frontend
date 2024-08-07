import {
    BodyLong,
    BodyLongProps,
    BodyShort,
    Detail,
    DetailProps,
    Label,
    LabelProps,
} from '@navikt/ds-react';
import React, { forwardRef } from 'react';
import { BodyShortProps } from '@navikt/ds-react';

export const BodyLongSmall = forwardRef<HTMLParagraphElement, Omit<BodyLongProps, 'size'>>(
    (props, ref) => {
        return <BodyLong size={'small'} {...props} ref={ref} />;
    }
);

export const BodyLongMedium = forwardRef<HTMLParagraphElement, Omit<BodyLongProps, 'size'>>(
    (props, ref) => {
        return <BodyLong size={'medium'} {...props} ref={ref} />;
    }
);

export const BodyShortSmall = forwardRef<HTMLParagraphElement, Omit<BodyShortProps, 'size'>>(
    (props, ref) => {
        return <BodyShort size={'small'} {...props} ref={ref} />;
    }
);

export const DetailSmall = forwardRef<HTMLParagraphElement, Omit<DetailProps, 'size'>>(
    (props, ref) => {
        return <Detail size={'small'} {...props} ref={ref} />;
    }
);

export const SmallTextLabel = forwardRef<HTMLParagraphElement, Omit<LabelProps, 'size'>>(
    (props, ref) => {
        return <Label size={'small'} {...props} ref={ref} as={'p'} />;
    }
);

export const TextLabel = forwardRef<HTMLParagraphElement, Omit<LabelProps, 'size'>>(
    (props, ref) => {
        return <Label {...props} ref={ref} as={'p'} />;
    }
);

BodyLongSmall.displayName = 'BodyLongSmall';
BodyLongMedium.displayName = 'BodyLongMedium';
BodyShortSmall.displayName = 'BodyShortSmall';
DetailSmall.displayName = 'DetailSmall';
SmallTextLabel.displayName = 'SmallTextLabel';
TextLabel.displayName = 'TextLabel';
