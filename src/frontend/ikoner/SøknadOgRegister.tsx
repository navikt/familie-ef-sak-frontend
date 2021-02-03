import * as React from 'react';

interface ISøknad {
    className?: string;
    heigth?: number;
    width?: number;
}

//Kopi av files-new
const SøknadOgRegister: React.FunctionComponent<ISøknad> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'søknad'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'søknad'}>Søknad ikon</title>
            <g
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path d="M20.5 23.5h-17v-23h11l6 6zM14.5.5v6h6M7.5 7.5h4.5M7.5 10.5h9M7.5 13.5h9M7.5 16.5h9M7.5 19.5h9" />
            </g>
            <g
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <ellipse cx="10" cy="4.5" rx="9.5" ry="4" />
                <path d="M19.499 8.5c0 2.209-4.254 4-9.5 4s-9.5-1.791-9.5-4M19.499 13c0 2.209-4.254 4-9.5 4s-9.5-1.791-9.5-4M.499 4.5v13c0 2.209 4.254 4 9.5 4s9.5-1.791 9.5-4v-13" />
            </g>
        </svg>
    );
};

export default SøknadOgRegister;
