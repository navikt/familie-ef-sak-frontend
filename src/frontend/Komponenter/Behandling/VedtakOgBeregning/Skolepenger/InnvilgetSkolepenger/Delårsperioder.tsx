import React, { Dispatch, SetStateAction } from 'react';
import { IPeriodeSkolepenger } from '../../../../../App/typer/vedtak';
import styled from 'styled-components';
import { ValideringsPropsMedOppdatering } from '../typer';
import { Label } from '@navikt/ds-react';
import { Visningsmodus } from './Skoleårsperiode';
import Delårsperiode from './Delårsperiode';

const Grid = styled.div<{
    erskoleårfjernet?: boolean;
}>`
    display: grid;
    grid-template-columns: repeat(7, max-content);
    gap: 0.25rem 1.5rem;
    text-decoration: ${(props) => (props.erskoleårfjernet === true ? 'line-through' : 'inherit')};
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

type Props = ValideringsPropsMedOppdatering<IPeriodeSkolepenger> & {
    delårsperioder: IPeriodeSkolepenger[];
    settDelårsperioder: Dispatch<SetStateAction<IPeriodeSkolepenger[]>>;
    visningsmodus: Visningsmodus;
};

const Delårsperioder: React.FC<Props> = ({
    behandlingErRedigerbar,
    delårsperioder,
    erOpphør,
    settDelårsperioder,
    settValideringsFeil,
    skoleårErFjernet,
    valideringsfeil,
    visningsmodus,
}) => {
    return (
        <Grid erskoleårfjernet={skoleårErFjernet}>
            <Label>Studietype</Label>
            <Label>Studiebelastning</Label>
            <Label>Periode fra og med</Label>
            <Label>Periode til og med</Label>
            <Label>Antall måneder</Label>
            {delårsperioder.map((periode, index) => (
                <Delårsperiode
                    antallDelårsperioder={delårsperioder.length}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    delårsperiode={periode}
                    erOpphør={erOpphør}
                    index={index}
                    key={index}
                    settDelårsperioder={settDelårsperioder}
                    skoleårErFjernet={skoleårErFjernet}
                    valideringsfeil={valideringsfeil}
                    visningsmodus={visningsmodus}
                />
            ))}
        </Grid>
    );
};

export default Delårsperioder;
