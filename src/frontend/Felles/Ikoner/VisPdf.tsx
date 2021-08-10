import * as React from 'react';

interface IOppfylt {
    className?: string;
    heigth?: number;
    width?: number;
}

const VisPdf: React.FC<IOppfylt> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'visPdf'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'visPdf'}>VisPdf</title>
            <g
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path d="M20.5 23.5h-17v-23h11l6 6zM14.5.5v6h6M7.5 7.5h4.5M7.5 10.5h9M7.5 13.5h9M7.5 16.5h9M7.5 19.5h9" />
            </g>
        </svg>
    );
};

export default VisPdf;
