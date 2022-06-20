import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { RessursStatus } from '../../../../App/typer/ressurs';
import styled from 'styled-components';
import { Heading, Label } from '@navikt/ds-react';
import { utledUtgiftsbeløp } from '../../../../App/utils/formatter';
import { useHentVilkår } from '../../../../App/hooks/useHentVilkår';

const BoldTekst = styled(Label)`
    margin-left: 0.25rem;
`;

const Container = styled.div`
    width: 250px;
`;

const HøyrestiltTekst = styled(Normaltekst)`
    display: flex;
    justify-content: right;
`;

const IkonOgTekstWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const Grid = styled.div`
    display: grid;
    grid-template-areas: 'utgiftstype utgiftsbeløp';
    grid-template-columns: 8.5rem 5rem;
    grid-gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

export const Søknadsutgifter: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkår, hentVilkår } = useHentVilkår();

    useEffect(() => {
        if (behandlingId !== undefined) {
            if (vilkår.status !== RessursStatus.SUKSESS) {
                hentVilkår(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const underUtdanning = vilkår?.grunnlag?.aktivitet?.underUtdanning;
                return (
                    <Container>
                        <Heading spacing size="small" level="5">
                            Utgifter fylt inn i søknad
                        </Heading>
                        <Grid>
                            <IkonOgTekstWrapper>
                                <Søknadsgrunnlag />
                                <BoldTekst size="small">Semesteravgift:</BoldTekst>
                            </IkonOgTekstWrapper>
                            <HøyrestiltTekst>
                                {utledUtgiftsbeløp(underUtdanning?.semesteravgift)}
                            </HøyrestiltTekst>
                        </Grid>
                        <Grid>
                            <IkonOgTekstWrapper>
                                <Søknadsgrunnlag />
                                <BoldTekst size="small">Studieavgift:</BoldTekst>
                            </IkonOgTekstWrapper>
                            <HøyrestiltTekst>
                                {utledUtgiftsbeløp(underUtdanning?.studieavgift)}
                            </HøyrestiltTekst>
                        </Grid>
                        <Grid>
                            <IkonOgTekstWrapper>
                                <Søknadsgrunnlag />
                                <BoldTekst size="small">Eksamensgebyr:</BoldTekst>
                            </IkonOgTekstWrapper>
                            <HøyrestiltTekst>
                                {utledUtgiftsbeløp(underUtdanning?.eksamensgebyr)}
                            </HøyrestiltTekst>
                        </Grid>
                    </Container>
                );
            }}
        </DataViewer>
    );
};
