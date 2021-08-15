import * as React from 'react';

interface IHjerte {
    className?: string;
    heigth?: number;
    width?: number;
}

const Hjerte: React.FC<IHjerte> = ({ className, heigth, width }) => {
    return (
        <svg
            aria-labelledby={'hjerte'}
            className={className}
            height={heigth || 25}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'hjerte'}>Hjerte</title>
            <g
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path
                    d="M17.408,0.518c-2.063,0-4.337,1.259-5.408,4.021c-1.055-2.719-3.271-3.958-5.28-3.958C3.877,0.582,1,3.021,1,7.683
	c0,8.456,10.286,15.355,10.725,15.645c0.083,0.056,0.18,0.083,0.275,0.083c0.108,0,0.216-0.035,0.306-0.104
	C12.743,22.969,23,14.938,23,7.091C23,2.776,20.187,0.518,17.408,0.518z M11.978,22.287C10.288,21.087,2,14.835,2,7.683
	c0-4.192,2.446-6.101,4.72-6.101c1.854,0,4.219,1.308,4.786,4.994C11.543,6.82,11.753,7,12,7s0.457-0.18,0.494-0.424
	c0.574-3.733,3.006-5.058,4.914-5.058C19.62,1.518,22,3.262,22,7.091C22,13.75,13.639,20.928,11.978,22.287z"
                />
            </g>
        </svg>
    );
};

export default Hjerte;
