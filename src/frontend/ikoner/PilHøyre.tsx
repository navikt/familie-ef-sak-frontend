import * as React from 'react';

interface IPilHøyre {
    className?: string;
    heigth?: number;
    width?: number;
}

const PilHøyre: React.FunctionComponent<IPilHøyre> = ({ className, heigth = 24, width = 24 }) => {
    return (
        <svg
            aria-labelledby={'pilhøyre'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'PilHøyre'}>PilHøyre</title>
            <polygon
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="#000000"
                stroke-linejoin="round"
                points="0.5,15.504 0.5,8.504 13.5,8.504 13.5,2.025 23.508,12   13.5,22.004 13.5,15.504 "
            />
        </svg>
    );
};

export default PilHøyre;
