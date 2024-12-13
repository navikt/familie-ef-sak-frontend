import { useCallback, useState } from 'react';
import { RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';

interface Props {
    gjenbrukbareVilkårsvurderinger: string[];
    hentAlleGjenbrukbareVilkårsvurderinger: (behandlingId: string) => void;
}

export const useHentGjenbrukbareVilkårsvurderinger = (): Props => {
    const [gjenbrukbareVilkårsvurderinger, settGjenbrukbareVilkårsvurderinger] = useState<string[]>(
        []
    );

    const { axiosRequest } = useApp();

    const hentAlleGjenbrukbareVilkårsvurderinger = useCallback(
        (behandlingId: string): void => {
            axiosRequest<string[], void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/gjenbrukbare-vilkar`,
            }).then((respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settGjenbrukbareVilkårsvurderinger(respons.data);
                } else {
                    settGjenbrukbareVilkårsvurderinger([]);
                }
            });
        },
        [axiosRequest]
    );

    return {
        gjenbrukbareVilkårsvurderinger,
        hentAlleGjenbrukbareVilkårsvurderinger,
    };
};
