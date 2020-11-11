import * as React from 'react';

interface IBygning {
    className?: string;
    heigth?: number;
    width?: number;
}

const Bygning: React.FC<IBygning> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'bygning'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'bygning'}>Bygning</title>
            <g
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path d="M3.5 2.5h17v21h-17zM10.5 19.5h3v4h-3zM10.5 14.5h3v3h-3zM15.5 14.5h3v3h-3zM5.5 14.5h3v3h-3zM10.5 9.5h3v3h-3zM15.5 9.5h3v3h-3zM5.5 9.5h3v3h-3zM10.5 4.5h3v3h-3zM15.5 4.5h3v3h-3zM5.5 4.5h3v3h-3zM18.5.5h-13l-2 2h17z" />
            </g>
        </svg>
    );
};

export default Bygning;
