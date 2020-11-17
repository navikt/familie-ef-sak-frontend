import * as React from 'react';

interface ISøknad {
    className?: string;
    heigth?: number;
    width?: number;
    withDefaultStroke?: boolean;
}

//Kopi av files-new
const RedigerBlyant: React.FunctionComponent<ISøknad> = ({
    className,
    heigth,
    width,
    withDefaultStroke = true,
}) => {
    return (
        <svg
            aria-labelledby={'rediger'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'rediger'}>Rediger</title>
            <g
                stroke={(withDefaultStroke && '#000') || undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path d="M7.516 21l-6.5 2 2-6.5 12-12 4.5 4.5zM15.016 4.5l3.086-3.085c.778-.777 2.05-.777 2.828 0l1.672 1.671c.778.779.778 2.051 0 2.829l-3.086 3.085M17.266 6.75l-10.75 10.75M3.016 16.5l1 1h2.5v2.5l1 1M2.016 20l2 2M16.516 3l4.5 4.5" />
            </g>
        </svg>
    );
};

export default RedigerBlyant;
