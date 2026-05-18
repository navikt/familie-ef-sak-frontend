import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

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

interface TemaContextType {
    tema: Tema;
    byttTema: () => void;
}

const TemaContext = createContext<TemaContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [tema, settTema] = useState<Tema>(hentLagretTema() ?? hentSystemTema());

    useEffect(() => {
        localStorage.setItem(TEMA_NØKKEL, tema);
    }, [tema]);

    const byttTema = useCallback(() => {
        settTema((gjeldende) => (gjeldende === 'light' ? 'dark' : 'light'));
    }, []);

    return <TemaContext.Provider value={{ tema, byttTema }}>{children}</TemaContext.Provider>;
};

const useTema = (): TemaContextType => {
    const context = useContext(TemaContext);
    if (!context) {
        throw new Error('useTema må brukes innenfor ThemeProvider');
    }
    return context;
};

export { ThemeProvider, useTema };
