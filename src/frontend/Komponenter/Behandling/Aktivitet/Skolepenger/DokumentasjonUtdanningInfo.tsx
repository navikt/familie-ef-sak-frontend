import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';

interface Props {
    grunnlag: IVilkårGrunnlag;
    skalViseSøknadsdata: boolean;
}

const DokumentasjonUtdanningInfo: FC<Props> = ({ grunnlag }) => {
    return (
        <GridTabell>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Skole/utdanningssted</Normaltekst>
                <Normaltekst>{grunnlag.aktivitet?.underUtdanning?.skoleUtdanningssted}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Linje/kurs/grad</Normaltekst>
                <Normaltekst>{grunnlag.aktivitet?.underUtdanning?.linjeKursGrad}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Utdanningstype</Normaltekst>
                <Normaltekst>
                    {grunnlag.aktivitet?.underUtdanning?.offentligEllerPrivat}
                </Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Studieperiode</Normaltekst>
                <Normaltekst>{`${formaterNullableIsoDato(
                    grunnlag.aktivitet?.underUtdanning?.fra
                )} -  ${formaterNullableIsoDato(
                    grunnlag.aktivitet?.underUtdanning?.til
                )}`}</Normaltekst>
            </>
            <>
                <Søknadsgrunnlag />
                <Normaltekst>Studiebelastning</Normaltekst>
                <Normaltekst>{`${grunnlag.aktivitet?.underUtdanning?.heltidEllerDeltid} - ${grunnlag.aktivitet?.underUtdanning?.hvorMyeSkalDuStudere}%`}</Normaltekst>
            </>
        </GridTabell>
    );
};

export default DokumentasjonUtdanningInfo;
