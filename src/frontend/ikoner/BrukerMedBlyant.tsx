import * as React from 'react';

interface IBrukerMedBlyant {
    className?: string;
    heigth?: number;
    width?: number;
}

//Kopi av user-edit-2
const BrukerMedBlyant: React.FunctionComponent<IBrukerMedBlyant> = ({
    className,
    heigth,
    width,
}) => {
    return (
        <svg
            aria-labelledby={'Bruker'}
            className={className}
            height={heigth}
            width={width}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title id={'brukerikon'}>Bruker ikon</title>
            <g fill="none" fillRule="evenodd">
                <g id="a" transform="translate(-53 -132)">
                    <g transform="translate(53 132)">
                        <g stroke="#000" stroke-linejoin="round" stroke-miterlimit="10" fill="none">
                            <path
                                d="m10.171-0.0035385-0.17826 0.0018462c-2.6783 0.049847-5.1993 1.1991-7.0976 3.2364-1.9122 2.052-2.9392 4.7383-2.8931 7.5648 0.095654 5.8497 4.4131 10.432 9.8289 10.432l0.17653-0.0018462c5.6053-0.10246 10.088-4.9487 9.9915-10.8-0.095654-5.8497-4.4131-10.433-9.8281-10.433z"
                                fill="#FFA733"
                                fillRule="nonzero"
                            />
                            <path
                                stroke-linecap="round"
                                d="M17 22.465l-3.5 1 1-3.5 6.5-6.5 2.5 2.5z"
                            />
                            <path d="M19 15.465l2.5 2.5" />
                            <path stroke-linecap="round" d="M14.5 19.965l2.5 2.5" />
                            <path d="M16.432 14.465c-.777-.257-3.932-1.68-4.932-2v-2.5s1.5-.62 1.5-3c1 0 1-2.071 0-2.071 0-.234.896-1.607.568-2.929-.475-1.905-6.061-1.905-6.534 0-2.368-.477-1.034 2.681-1.034 3-.5 0-.5 2 0 2 0 2.38 1.5 3 1.5 3v2.5c-2.5 1.055-6.02 1.755-6.432 3-.474 1.429-.568 4.035-.568 4.035h10.5" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default BrukerMedBlyant;
