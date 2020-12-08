import React, { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering, VilkårGruppe, Vurderingsfeilmelding } from './vilkår';
import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';

const StyledInngangsvilkår = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

interface Props {
    behandlingId: string;
}

const oppdaterInngangsvilkårMedVurdering = (
    inngangsvilkår: RessursSuksess<IInngangsvilkår>,
    vurdering: IVurdering
) => ({
    ...inngangsvilkår,
    data: {
        ...inngangsvilkår.data,
        vurderinger: inngangsvilkår.data.vurderinger.map((tidligereVurdering) =>
            tidligereVurdering.id === vurdering.id ? vurdering : tidligereVurdering
        ),
    },
});

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const [inngangsvilkår, settInngangsvilkår] = useState<Ressurs<IInngangsvilkår>>(
        byggTomRessurs()
    );
    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});
    const { axiosRequest } = useApp();

    const hentInngangsvilkår = (behandlingId: string) => {
        axiosRequest<IInngangsvilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar`,
        }).then((hentetInngangsvilkår: Ressurs<IInngangsvilkår>) => {
            settInngangsvilkår(hentetInngangsvilkår);
        });
    };

    function fjernFeilemelding(vurdering: IVurdering) {
        settFeilmeldinger((prevFeilmeldinger) => {
            const prevFeilmeldingerCopy = { ...prevFeilmeldinger };
            delete prevFeilmeldingerCopy[vurdering.id];
            return prevFeilmeldingerCopy;
        });
    }

    function leggTilFeilmelding(vurdering: IVurdering, feilmelding: string) {
        settFeilmeldinger((prevFeilmeldinger) => {
            return {
                ...prevFeilmeldinger,
                [vurdering.id]: feilmelding,
            };
        });
    }

    const lagreVurdering = (vurdering: IVurdering): Promise<Ressurs<string>> => {
        return axiosRequest<string, IVurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/inngangsvilkar`,
            data: vurdering,
        }).then((respons: Ressurs<string>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    fjernFeilemelding(vurdering);
                    settInngangsvilkår((prevInngangsvilkår: Ressurs<IInngangsvilkår>) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IInngangsvilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                            vurdering
                        )
                    );
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    leggTilFeilmelding(vurdering, respons.frontendFeilmelding);
                    return respons;
                default:
                    return respons;
            }
        });
    };

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (inngangsvilkår.status !== RessursStatus.SUKSESS) {
                hentInngangsvilkår(behandlingId);
            }
        }
    }, [behandlingId]);
    return (
        <>
            <DataViewer response={inngangsvilkår}>
                {(data) => (
                    <StyledInngangsvilkår>
                        {Object.keys(VilkårGruppe).map((vilkårGruppe) => (
                            <Vurdering
                                key={vilkårGruppe}
                                vilkårGruppe={vilkårGruppe as VilkårGruppe}
                                inngangsvilkår={data}
                                feilmeldinger={feilmeldinger}
                                lagreVurdering={lagreVurdering}
                            />
                        ))}
                    </StyledInngangsvilkår>
                )}
            </DataViewer>
        </>
    );
};

export default Inngangsvilkår;
