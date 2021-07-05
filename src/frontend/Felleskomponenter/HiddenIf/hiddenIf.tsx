import React from 'react';

export interface HiddenProps {
    hidden?: boolean;
}

export default function hiddenIf<PROPS>(
    Component: React.ComponentType<PROPS>
): React.ComponentType<PROPS & HiddenProps> {
    return (props: PROPS & HiddenProps) => {
        // eslint-disable-next-line
        const { hidden, ...rest } = props as any;
        if (hidden) {
            return null;
        }
        return <Component {...rest} />;
    };
}
