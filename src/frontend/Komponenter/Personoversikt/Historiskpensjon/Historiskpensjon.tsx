import React, { useEffect } from 'react';
import styled from 'styled-components';
import { AlertInfo, AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { useHentHistoriskPensjon } from '../../../App/hooks/useHentHistoriskPensjon';

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
    const { hentForFagsakPersonId, historiskPensjon } = useHentHistoriskPensjon();

    useEffect(() => {
        hentForFagsakPersonId(fagsakPersonId);
    }, [hentForFagsakPersonId, fagsakPersonId]);

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
                                    icon={<ExternalLinkIcon />}
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
