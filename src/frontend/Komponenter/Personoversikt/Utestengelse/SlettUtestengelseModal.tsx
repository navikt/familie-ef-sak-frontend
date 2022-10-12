import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import React, { FC, useState } from 'react';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { BodyShort } from '@navikt/ds-react';

export const SlettUtestengelseModal: FC<{
    fagsakPersonId: string;
    id: string | undefined;
    clearId: () => void;
    hentUtestengelser: () => void;
}> = ({ fagsakPersonId, id, clearId, hentUtestengelser }) => {
    const { axiosRequest } = useApp();

    const [feilmelding, settFeilmelding] = useState<string>('');
    const [laster, settLaster] = useState(false);

    const lukkModal = () => {
        settFeilmelding('');
        settLaster(false);
        clearId();
    };

    const slettUtestengelse = (fagsakPersonid: string, id: string) => {
        settFeilmelding('');
        if (laster) {
            return;
        }
        settLaster(true);
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `/familie-ef-sak/api/utestengelse/${fagsakPersonid}/${id}`,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentUtestengelser();
                lukkModal();
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
            settLaster(false);
        });
    };
    if (!id) {
        return null;
    }

    return (
        <ModalWrapper
            tittel={'Vil du slette utestengelsen?'}
            visModal={true}
            lukkKnappTekst={'Avbryt'}
            lukkKnappClick={lukkModal}
            lukkKnappDisabled={laster}
            hovedKnappTekst={'Slett utestengelsen'}
            hovedKnappClick={() => slettUtestengelse(fagsakPersonId, id)}
            hovedKnappDisabled={laster}
            onClose={lukkModal}
            closeButton={true}
        >
            <BodyShort>Utestengelsen vil bli slettet på brukeren</BodyShort>
            {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
        </ModalWrapper>
    );
};
