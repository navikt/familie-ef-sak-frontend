import * as React from 'react';

interface IPass {
    className?: string;
    heigth?: number;
    width?: number;
}

const Pass: React.FC<IPass> = ({ className, heigth, width }) => {
    return (
        <>
            <svg
                aria-labelledby={'pass'}
                className={className}
                height={heigth || 24}
                width={width || 24}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title id={'pass'}>Pass</title>
                <path
                    fill="#3E3832"
                    fillRule="evenodd"
                    d="M19 2H4v20h15V2zM2 0v24h17a2 2 0 002-2V2a2 2 0 00-2-2H2zm9.5 14A4.826 4.826 0 0015 9.36V6H8v3.36A4.826 4.826 0 0011.5 14zM10 8v1.36c0 1.06.591 2.013 1.5 2.496A2.826 2.826 0 0013 9.36V8h-3zm6 10v-2H7v2h9z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </>
    );
};

export default Pass;
