import * as React from 'react';

interface ILeggTilMedSirkel {
    className?: string;
    heigth?: number;
    width?: number;
}

const LeggTilMedSirkel: React.FC<ILeggTilMedSirkel> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'leggtilSirkel'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'leggtilSirkel'}>LeggtilSirkel</title>
            <g
                xmlns="http://www.w3.org/2000/svg"
                stroke="#0067C5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <circle cx="11.5" cy="11.5" r="11" />
                <path d="M11.5 5.5v12M17.5 11.5h-12" />
            </g>
        </svg>
    );
};

export default LeggTilMedSirkel;
