import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/overgangsstønad';
import { SeksjonWrapper } from '../../../../Felles/Visningskomponenter/SeksjonWrapper';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const AktivitetInfo: FC<Props> = ({ aktivitet, skalViseSøknadsdata }) => {
    const { arbeidsforhold } = aktivitet;
    console.log('arbeidsforhold', arbeidsforhold);

    return (
        <>
            <SeksjonWrapper>{skalViseSøknadsdata && 'Søknadsdata'}</SeksjonWrapper>
        </>
    );
};

export default AktivitetInfo;
