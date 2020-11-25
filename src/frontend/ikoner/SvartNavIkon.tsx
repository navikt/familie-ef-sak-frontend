import * as React from 'react';

interface ISvartNavIkon {
    className?: string;
    heigth?: number;
    width?: number;
}

const SvartNavIkon: React.FC<ISvartNavIkon> = ({ className, heigth, width }) => {
    return (
        <>
            <svg
                aria-labelledby={'nav'}
                className={className}
                height={heigth || 76}
                width={width || 48}
                viewBox="0 0 269 169"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title id={'nav'}>Svart nav ikon</title>
                <path
                    fill="#3E3832"
                    fillRule="evenodd"
                    d="M125.309 168.942c-46.64 0-84.46-37.817-84.46-84.465C40.85 37.824 78.67 0 125.31 0c46.658 0 84.481 37.824 84.481 84.477 0 46.648-37.823 84.465-84.481 84.465zM0 121.359l17.265-42.73h16.589l-17.243 42.73H0zM213.044 121.359l17.044-42.73h9.044l-17.043 42.73h-9.045zM246.564 121.359l17.041-42.73h4.803l-17.043 42.73h-4.801z"
                    clipRule="evenodd"
                ></path>
                <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M197.36 78.63h-15.016s-1.035 0-1.401.914l-8.31 25.439-8.303-25.44c-.366-.913-1.407-.913-1.407-.913h-28.872c-.625 0-1.149.522-1.149 1.143v8.639c0-6.853-7.292-9.782-11.562-9.782-9.562 0-15.963 6.298-17.956 15.873-.108-6.352-.636-8.628-2.347-10.96-.786-1.141-1.922-2.101-3.159-2.895-2.547-1.492-4.834-2.018-9.749-2.018h-5.77s-1.044 0-1.412.914l-5.25 13.013V79.773c0-.621-.52-1.143-1.145-1.143H61.198s-1.03 0-1.406.914l-5.459 13.53s-.545 1.354.701 1.354h5.133v25.784c0 .64.504 1.147 1.147 1.147h13.238c.624 0 1.144-.507 1.144-1.147V94.428h5.16c2.961 0 3.588.08 4.74.618.694.262 1.32.792 1.66 1.403.698 1.314.873 2.892.873 7.545v16.218c0 .64.514 1.147 1.15 1.147h12.687s1.434 0 2.001-1.416l2.812-6.95c3.739 5.237 9.893 8.366 17.541 8.366h1.671s1.443 0 2.014-1.416l4.897-12.128v12.397c0 .64.524 1.147 1.149 1.147h12.952s1.429 0 2.003-1.416c0 0 5.18-12.861 5.2-12.958h.008c.199-1.07-1.153-1.07-1.153-1.07h-4.623V83.847l14.545 36.096c.568 1.416 2 1.416 2 1.416h15.301s1.44 0 2.008-1.416l16.125-39.93c.558-1.383-1.057-1.383-1.057-1.383zm-64.458 27.285h-8.7c-3.463 0-6.28-2.804-6.28-6.271 0-3.461 2.817-6.283 6.28-6.283h2.433c3.454 0 6.267 2.822 6.267 6.283v6.271z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </>
    );
};

export default SvartNavIkon;
