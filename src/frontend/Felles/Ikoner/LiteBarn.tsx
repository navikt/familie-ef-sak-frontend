import * as React from 'react';

interface ILiteBarn {
    className?: string;
    heigth?: number;
    width?: number;
}

const LiteBarn: React.FC<ILiteBarn> = ({ className, heigth, width }) => {
    return (
        <>
            <svg
                aria-labelledby={'liteBarn'}
                className={className}
                height={heigth || 24}
                width={width || 14}
                viewBox="0 0 14 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title id={'liteBarn'}>Lite barn</title>
                <path
                    fill="#3E3832"
                    fillRule="evenodd"
                    d="M8 0l.001 2.071c.341.049.675.122.998.219L9.697.723l1.827.813-.709 1.594A6.994 6.994 0 0114 9a6.997 6.997 0 01-3.55 6.092A5.99 5.99 0 0113 20v4h-2v-4c0-.122-.005-.244-.016-.363C9.982 20.785 8.567 21.5 7 21.5c-1.567 0-2.982-.716-3.983-1.864l-.012.163L3 20v4H1v-4a5.993 5.993 0 012.55-4.91A6.994 6.994 0 010 9a6.994 6.994 0 013.185-5.87l-.709-1.594L4.303.723l.698 1.567c.324-.097.657-.17.999-.22V0h2zM7 16a3.993 3.993 0 00-3.154 1.54C4.486 18.715 5.658 19.5 7 19.5c1.342 0 2.515-.785 3.154-1.959A3.99 3.99 0 007.2 16.005L7 16zM7 4a5 5 0 100 10A5 5 0 007 4zM5 8a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </>
    );
};

export default LiteBarn;
