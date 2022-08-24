import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import { IDokumentasjon } from '../../../App/typer/felles';

interface Props {
    tittel: string;
    dokumentasjon?: IDokumentasjon;
}

const DokumentasjonSendtInn: FC<Props> = ({ tittel, dokumentasjon }) => {
    return dokumentasjon && dokumentasjon.harSendtInn ? (
        <>
            <Søknadsgrunnlag />
            <Normaltekst>{tittel}</Normaltekst>
            <Normaltekst>Dokumentasjon er sendt inn til NAV tidligere</Normaltekst>
        </>
    ) : null;
};
export default DokumentasjonSendtInn;
