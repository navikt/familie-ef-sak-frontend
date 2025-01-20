import React from 'react';
import styled from 'styled-components';
import { Alert, ReadMore } from '@navikt/ds-react';
import { KsPeriode } from '../../../Inngangsvilkår/vilkår';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { formaterNullableIsoDato } from '../../../../../App/utils/formatter';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

interface Props {
    harKontantstøttePerioder?: boolean;
    kontantstøttePerioderGrunnlagsdata?: KsPeriode[];
}

const kontantstøtteKilde = (kilde: string): string => {
    return kilde.toLowerCase();
};

export const KontantstøtteAlert: React.FC<Props> = ({
    harKontantstøttePerioder,
    kontantstøttePerioderGrunnlagsdata,
}) => {
    if (harKontantstøttePerioder === null || harKontantstøttePerioder === undefined) {
        return null;
    }

    return (
        <>
            <AlertStripe variant="info">
                {harKontantstøttePerioder
                    ? 'Brukers kontantstøtteperioder'
                    : 'Bruker har verken fått eller får kontantstøtte'}
                {harKontantstøttePerioder && kontantstøttePerioderGrunnlagsdata && (
                    <>
                        <div style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                            <li>
                                <BodyShortSmall style={{ display: 'inline' }}>
                                    {formaterNullableIsoDato(
                                        kontantstøttePerioderGrunnlagsdata[0].fomMåned
                                    )}{' '}
                                    -{' '}
                                    {formaterNullableIsoDato(
                                        kontantstøttePerioderGrunnlagsdata[0].tomMåned
                                    )}{' '}
                                    {'(kilde: ' +
                                        kontantstøtteKilde(
                                            kontantstøttePerioderGrunnlagsdata[0].kilde
                                        ) +
                                        ')'}
                                </BodyShortSmall>
                            </li>
                        </div>
                        {kontantstøttePerioderGrunnlagsdata.length > 1 && (
                            <ReadMore header="Se flere perioder">
                                {kontantstøttePerioderGrunnlagsdata
                                    .slice(1)
                                    .map((periode, index) => (
                                        <li key={index}>
                                            <BodyShortSmall style={{ display: 'inline' }}>
                                                {formaterNullableIsoDato(periode.fomMåned)} -{' '}
                                                {formaterNullableIsoDato(periode.tomMåned)}
                                                {' (kilde: ' +
                                                    kontantstøtteKilde(
                                                        kontantstøttePerioderGrunnlagsdata[0].kilde
                                                    ) +
                                                    ')'}
                                            </BodyShortSmall>
                                        </li>
                                    ))}
                            </ReadMore>
                        )}
                    </>
                )}
            </AlertStripe>
        </>
    );
};
