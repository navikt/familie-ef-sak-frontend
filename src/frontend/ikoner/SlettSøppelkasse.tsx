import * as React from 'react';

interface ISøknad {
    className?: string;
    heigth?: number;
    width?: number;
    withDefaultStroke?: boolean;
}

const SlettSøppelkasse: React.FunctionComponent<ISøknad> = ({
    className,
    heigth,
    width,
    withDefaultStroke = true,
}) => {
    return (
        <svg
            aria-labelledby={'slett'}
            className={className}
            width={width ? width : 24}
            height={heigth ? heigth : 24}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                stroke={(withDefaultStroke && '#000') || undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.016 3H19.516H16.016V0.5C16.016 0.224 15.792 0 15.516 0H7.51599C7.23999 0 7.01599 0.224 7.01599 0.5V3H3.51599H1.01599C0.739991 3 0.515991 3.224 0.515991 3.5C0.515991 3.776 0.738991 4 1.01599 4H3.01599V23.5C3.01599 23.776 3.23999 24 3.51599 24H19.516C19.792 24 20.016 23.776 20.016 23.5V4H23.016C23.292 4 23.516 3.776 23.516 3.5C23.516 3.224 23.292 3 23.016 3ZM8.01599 1H15.016V3H8.01599V1ZM4.01599 23H19.016V4H15.516H7.51599H4.01599V23Z"
                    fill="#3E3832"
                />
                <path
                    d="M7.51599 6.5C7.23999 6.5 7.01599 6.724 7.01599 7V19C7.01599 19.276 7.23999 19.5 7.51599 19.5C7.79199 19.5 8.01599 19.276 8.01599 19V7C8.01599 6.724 7.79199 6.5 7.51599 6.5Z"
                    fill="#3E3832"
                />
                <path
                    d="M11.516 6.5C11.24 6.5 11.016 6.724 11.016 7V19C11.016 19.276 11.24 19.5 11.516 19.5C11.792 19.5 12.016 19.276 12.016 19V7C12.016 6.724 11.792 6.5 11.516 6.5Z"
                    fill="#3E3832"
                />
                <path
                    d="M15.016 7V19C15.016 19.276 15.24 19.5 15.516 19.5C15.792 19.5 16.016 19.276 16.016 19V7C16.016 6.724 15.792 6.5 15.516 6.5C15.24 6.5 15.016 6.724 15.016 7Z"
                    fill="#3E3832"
                />
            </g>
        </svg>
    );
};

export default SlettSøppelkasse;
