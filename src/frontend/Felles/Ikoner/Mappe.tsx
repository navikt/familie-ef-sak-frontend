import * as React from 'react';

interface IMappe {
    className?: string;
    heigth?: number;
    width?: number;
}

const Mappe: React.FunctionComponent<IMappe> = ({ className, heigth = 24, width = 24 }) => {
    return (
        <svg
            aria-labelledby={'mappe'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'Mappe'}>Mappe</title>
            <path
                xmlns="http://www.w3.org/2000/svg"
                d="M20.5,7H9.707L7.854,5.147C7.76,5.053,7.633,5,7.5,5h-5C2.225,5,2,5.224,2,5.5v14C2,19.777,2.225,20,2.5,20h18  c0.277,0,0.5-0.223,0.5-0.5v-12C21,7.224,20.777,7,20.5,7z"
            />
        </svg>
    );
};

export default Mappe;
