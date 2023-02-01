import React, { useMemo } from 'react';
import styled from 'styled-components';
import { AlertInfo, AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IHistoriskPensjon } from '../../../App/typer/historiskpensjon';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, Link } from '@navikt/ds-react';
import { ExternalLink } from '@navikt/ds-icons';

const FlexBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
`;

const StyledWarningStripe = styled(AlertWarning)`
    width: 40rem;
`;

const StyledInfoStripe = styled(AlertInfo)`
    width: 40rem;
`;

const Historiskpensjon: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const historiskPensjonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/historiskpensjon/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    const historiskPensjon = useDataHenter<IHistoriskPensjon, null>(historiskPensjonConfig);

    return (
        <DataViewer response={{ historiskPensjon }}>
            {({ historiskPensjon }) => {
                const harPensjondata = historiskPensjon.harPensjonsdata;
                return harPensjondata ? (
                    <StyledWarningStripe>
                        <FlexBox>
                            <BodyShort>Bruker har fått stønad før desember 2008</BodyShort>
                            <Link href={historiskPensjon.webAppUrl} target={'_blank'}>
                                <Button
                                    type={'button'}
                                    as={'p'}
                                    size={'small'}
                                    variant={'tertiary'}
                                    icon={<ExternalLink />}
                                    iconPosition={'right'}
                                >
                                    Se vedtaksperioder
                                </Button>
                            </Link>
                        </FlexBox>
                    </StyledWarningStripe>
                ) : (
                    <StyledInfoStripe>
                        Bruker har ikke fått stønad før desember 2008
                    </StyledInfoStripe>
                );
            }}
        </DataViewer>
    );
};

export default Historiskpensjon;
