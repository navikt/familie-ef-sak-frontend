import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { IDokumentasjon } from '../../../App/typer/felles';

interface Props {
    tittel: string;
    dokumentasjon?: IDokumentasjon;
}

const DokumentasjonSendtInn: FC<Props> = ({ tittel, dokumentasjon }) => {
    return dokumentasjon && dokumentasjon.harSendtInn ? (
        <>
            <Søknadsgrunnlag />
            <Element>{tittel}</Element>
            <Normaltekst>Dokumentasjon er sendt inn til NAV tidligere</Normaltekst>
        </>
    ) : null;
};
export default DokumentasjonSendtInn;
