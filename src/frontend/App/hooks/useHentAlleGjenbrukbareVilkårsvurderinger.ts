import { useCallback, useState } from 'react';
import { RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';

interface Props {
    gjenbrukbareVilkårsvurderinger: string[];
    hentAlleGjenbrukbareVilkårsvurderinger: (behandlingId: string) => Promise<void>;
}

export const useHentAlleGjenbrukbareVilkårsvurderinger = (): Props => {
    const [gjenbrukbareVilkårsvurderinger, settGjenbrukbareVilkårsvurderinger] = useState<string[]>(
        []
    );

    const { axiosRequest } = useApp();

    const hentAlleGjenbrukbareVilkårsvurderinger = useCallback(
        async (behandlingId: string): Promise<void> => {
            const respons = await axiosRequest<string[], void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/gjenbrukbare-vilkår`,
            });
            if (respons.status === RessursStatus.SUKSESS) {
                settGjenbrukbareVilkårsvurderinger(respons.data);
            } else {
                settGjenbrukbareVilkårsvurderinger([]);
            }
        },
        [axiosRequest]
    );

    return {
        gjenbrukbareVilkårsvurderinger,
        hentAlleGjenbrukbareVilkårsvurderinger,
    };
};
