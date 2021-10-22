import React, { FC, useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { erBehandlingRedigerbar } from '../../../App/typer/behandlingstatus';
import { Radio } from 'nav-frontend-skjema';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useHistory } from 'react-router-dom';
import { Behandlingstype } from '../../../App/typer/behandlingstype';

enum EHenlagtårsak {
    TRUKKET_TILBAKE = 'TRUKKET_TILBAKE',
    FEILREGISTRERT = 'FEILREGISTRERT',
    BEHANDLES_I_GOSYS = 'BEHANDLES_I_GOSYS',
}

export const Henlegg: FC<{ behandling: Behandling; fagsakId: string }> = ({
    behandling,
    fagsakId,
}) => {
    const { axiosRequest } = useApp();
    const behandlingRedigerbar = erBehandlingRedigerbar(behandling);
    const erBlankett = behandling.type === Behandlingstype.BLANKETT;
    const history = useHistory();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);

    const lagreHenleggelse = () => {
        if (låsKnapp) {
            return;
        }
        settLåsKnapp(true);
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak,
            },
        })
            .then((response: Ressurs<string>) => {
                switch (response.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/fagsak/${fagsakId}`);
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    if (behandlingRedigerbar && !erBlankett) {
        return (
            <>
                <hr />
                <FamilieRadioGruppe erLesevisning={false} legend={<>Henlegg</>}>
                    <Radio
                        checked={henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE}
                        label="Trukket tilbake"
                        name="henleggRadio"
                        onChange={() => {
                            settHenlagtårsak(EHenlagtårsak.TRUKKET_TILBAKE);
                        }}
                    />
                    <Radio
                        checked={henlagtårsak === EHenlagtårsak.FEILREGISTRERT}
                        label="Feilregistrert"
                        name="henleggRadio"
                        onChange={() => {
                            settHenlagtårsak(EHenlagtårsak.FEILREGISTRERT);
                        }}
                    />
                    <Hovedknapp htmlType={'submit'} onClick={lagreHenleggelse} disabled={låsKnapp}>
                        Henlegg
                    </Hovedknapp>
                </FamilieRadioGruppe>
            </>
        );
    } else if (behandlingRedigerbar && erBlankett) {
        return (
            <Hovedknapp
                htmlType={'submit'}
                onClick={() => {
                    settHenlagtårsak(EHenlagtårsak.BEHANDLES_I_GOSYS);
                    lagreHenleggelse();
                }}
                disabled={låsKnapp}
            >
                Henlegg
            </Hovedknapp>
        );
    } else {
        return <></>;
    }
};
