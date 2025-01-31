import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Button } from '@navikt/ds-react';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { KontantstøttePeriode } from '../../../Inngangsvilkår/vilkår';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { formaterNullableIsoDato } from '../../../../../App/utils/formatter';

const AlertStripe = styled(Alert)`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 1rem;
`;

const InnholdContainer = styled.ul`
    margin-left: 1rem;
    padding-left: 0.5rem;
    margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
    margin-left: 1rem;
    padding-left: 0.5rem;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
`;

interface Props {
    harKontantstøttePerioder?: boolean;
    kontantstøttePerioderFraGrunnlagsdata: KontantstøttePeriode[];
}

const utledKontantstøtteperioderAlertTekst = (
    kontantstøttePerioderFraGrunnlagsdata: KontantstøttePeriode[],
    harKontantstøttePerioder?: boolean
): string => {
    if (!harKontantstøttePerioder && kontantstøttePerioderFraGrunnlagsdata.length === 0) {
        return 'Bruker har verken fått eller får kontantstøtte';
    }
    if (kontantstøttePerioderFraGrunnlagsdata.length > 0) {
        return `Brukers kontantstøtteperioder (hentet ${formaterNullableIsoDato(
            kontantstøttePerioderFraGrunnlagsdata[0].hentetDato
        )})`;
    }
    return 'Bruker har eller har fått kontantstøtte';
};

const kontantstøtteKilde = (kilde: string): string => {
    return kilde.toLowerCase().includes('kontantstøtte') ? 'KS sak' : kilde.toLowerCase();
};

export const KontantstøtteAlert: React.FC<Props> = ({
    harKontantstøttePerioder,
    kontantstøttePerioderFraGrunnlagsdata,
}) => {
    const [ekspandert, settEkspandert] = useState(false);
    const harFlereKontantstøttePerioder = kontantstøttePerioderFraGrunnlagsdata.length > 1;

    return (
        <AlertStripe variant="info">
            {utledKontantstøtteperioderAlertTekst(
                kontantstøttePerioderFraGrunnlagsdata,
                harKontantstøttePerioder
            )}
            {kontantstøttePerioderFraGrunnlagsdata.length > 0 && (
                <>
                    <InnholdContainer>
                        <li>
                            <BodyShortSmall>
                                {formaterNullableIsoDato(
                                    kontantstøttePerioderFraGrunnlagsdata[0].fomMåned
                                )}{' '}
                                -{' '}
                                {kontantstøttePerioderFraGrunnlagsdata[0].tomMåned
                                    ? formaterNullableIsoDato(
                                          kontantstøttePerioderFraGrunnlagsdata[0].tomMåned
                                      )
                                    : ''}{' '}
                                {'(kilde: ' +
                                    kontantstøtteKilde(
                                        kontantstøttePerioderFraGrunnlagsdata[0].kilde
                                    ) +
                                    ')'}
                            </BodyShortSmall>
                        </li>
                        {harFlereKontantstøttePerioder &&
                            ekspandert &&
                            kontantstøttePerioderFraGrunnlagsdata.slice(1).map((periode, index) => (
                                <li key={index}>
                                    <BodyShortSmall>
                                        {formaterNullableIsoDato(periode.fomMåned)} -{' '}
                                        {periode.tomMåned
                                            ? formaterNullableIsoDato(periode.tomMåned)
                                            : ''}{' '}
                                        {'(kilde: ' + kontantstøtteKilde(periode.kilde) + ')'}
                                    </BodyShortSmall>
                                </li>
                            ))}
                    </InnholdContainer>
                    {harFlereKontantstøttePerioder && (
                        <StyledButton
                            variant="tertiary"
                            icon={ekspandert ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            iconPosition="right"
                            onClick={() => settEkspandert((prev) => !prev)}
                        >
                            {ekspandert ? 'Skjul perioder' : 'Se flere perioder'}
                        </StyledButton>
                    )}
                </>
            )}
        </AlertStripe>
    );
};
