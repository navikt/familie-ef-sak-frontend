import React from 'react';
import { Utsendingsinfo as UtsendingsinfoType } from '../../App/typer/utsendingsinfo';
import { BodyShortSmall } from '../../Felles/Visningskomponenter/Tekster';

export const Utsendingsinfo: React.FC<{ utsendingsinfo: UtsendingsinfoType | undefined }> = ({
    utsendingsinfo,
}) =>
    utsendingsinfo ? (
        <>
            {utsendingsinfo.digitalpostSendt && <BodyShortSmall>Digital post sendt</BodyShortSmall>}
            {utsendingsinfo.fysiskpostSendt && <BodyShortSmall>Fysisk post sendt</BodyShortSmall>}
        </>
    ) : null;
