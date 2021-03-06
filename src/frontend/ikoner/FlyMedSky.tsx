import * as React from 'react';

interface IFlyMedSky {
    className?: string;
    heigth?: number;
    width?: number;
}

const FlyMedSky: React.FC<IFlyMedSky> = ({ className, heigth, width }) => {
    return (
        <>
            <svg
                aria-labelledby={'flyMedSky'}
                className={className}
                height={heigth || 25}
                width={width || 24}
                viewBox="0 0 24 25"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title id={'flyMedSky'}>Fly med sky</title>
                <path
                    fill="#3E3832"
                    fillRule="evenodd"
                    d="M15 16a7 7 0 016.929 8.001h-2.03a5 5 0 00-9.37-3.243A5.474 5.474 0 0111.979 24H9.965a3.5 3.5 0 00-6.93 0H1.022a5.5 5.5 0 017.884-4.447A6.997 6.997 0 0115 16zM5.493.301l7.715 4.832 4.81-1.397c1.869-.543 3.912.059 5.378 1.584.742.772.81 2.03.15 2.809a1.652 1.652 0 01-.8.525L8.512 12.79c-1.838.534-3.763.023-5.235-1.221l-2.116.613-.548-1.938 1.235-.358a7.167 7.167 0 01-.224-.398L0 5.826l2.513-.73c.577-.168 1.208 0 1.68.445l2.369 1.524.283-.083-5.048-5.569L3.322.353A1.968 1.968 0 015.493.301zm.335 2.58l5.166 5.745-2.08.627-.565-.61-2.099.61-3.278-2.11-.068-.064-.148.043.65 1.467.085.155c.114.197.238.382.372.556l1.53-.445.55 1.938-.02.007c.607.2 1.244.24 1.859.1l.182-.048 14.035-4.078-.01-.02-.018-.028c-.913-.95-2.115-1.34-3.212-1.1l-.193.048L13 7.326 5.828 2.88z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </>
    );
};

export default FlyMedSky;
