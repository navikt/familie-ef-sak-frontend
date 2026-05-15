import { useCallback, useEffect, useState } from 'react';
import constate from 'constate';

type Tema = 'light' | 'dark';

const TEMA_NØKKEL = 'ef-sak-tema';

const hentSystemTema = (): Tema =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const hentLagretTema = (): Tema | null => {
    const lagret = localStorage.getItem(TEMA_NØKKEL);
    if (lagret === 'light' || lagret === 'dark') {
        return lagret;
    }
    return null;
};

const [ThemeProvider, useTema] = constate(() => {
    const [tema, settTema] = useState<Tema>(hentLagretTema() ?? hentSystemTema());

    useEffect(() => {
        localStorage.setItem(TEMA_NØKKEL, tema);
    }, [tema]);

    const byttTema = useCallback(() => {
        settTema((gjeldende) => (gjeldende === 'light' ? 'dark' : 'light'));
    }, []);

    return { tema, byttTema };
});

export { ThemeProvider, useTema };
