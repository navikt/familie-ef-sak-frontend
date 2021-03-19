import * as React from 'react';
import styled from 'styled-components';

interface IRegister {
    className?: string;
    heigth?: number;
    width?: number;
}

export const RegisterSVG = styled.svg`
    margin-top: 3px;
`;

//Kopi av database
const Register: React.FunctionComponent<IRegister> = ({ className, heigth, width }) => {
    return (
        <RegisterSVG
            aria-labelledby={'register'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'register'}>Register ikon</title>
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
        </RegisterSVG>
    );
};

export default Register;
