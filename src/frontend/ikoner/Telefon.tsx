import * as React from 'react';

interface ITelefon {
    className?: string;
    heigth?: number;
    width?: number;
}

const Telefon: React.FC<ITelefon> = ({ className, heigth, width }) => {
    return (
        <>
            <svg
                aria-labelledby={'telefon'}
                className={className}
                height={heigth || 24}
                width={width || 24}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title id={'telefon'}>Telefon</title>
                <path
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M8.586 7.902c.902-.904.902-2.367 0-3.27l-2.454-2.454c-.903-.903-2.368-.903-3.271 0l-1.345 1.345c-1.168 1.168-1.349 2.989-.439 4.366 3.909 5.91 9.124 11.125 15.034 15.034 1.375.909 3.201.728 4.365-.437l1.346-1.347c.903-.903.903-2.368 0-3.271l-2.453-2.453c-.902-.904-2.367-.904-3.271 0l-.817.818c-2.69-2.205-5.309-4.824-7.513-7.515l.818-.816z"
                    fill="none"
                />
            </svg>
        </>
    );
};

export default Telefon;
