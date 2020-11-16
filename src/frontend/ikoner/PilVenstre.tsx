import * as React from 'react';

interface IPilVenstre {
    className?: string;
    heigth?: number;
    width?: number;
}

const PilVenstre: React.FunctionComponent<IPilVenstre> = ({
    className,
    heigth = 24,
    width = 24,
}) => {
    return (
        <svg
            aria-labelledby={'pilvenstre'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'PilVenstre'}>PilVenstre</title>
            <polygon
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#000000"
                stroke-linejoin="round"
                points="23.5,15.504 23.5,8.504 10.5,8.504 10.5,2.025 0.491,12   10.5,22.004 10.5,15.504 "
            />{' '}
        </svg>
    );
};

export default PilVenstre;
