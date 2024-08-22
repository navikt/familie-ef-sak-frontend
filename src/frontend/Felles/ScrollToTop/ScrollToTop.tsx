import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const scrollTilTopp = () => {
            const container = document.querySelector('#scroll-topp');
            if (container) {
                container.scrollTop = 0;
            } else {
                window.scrollTo(0, 0);
            }
        };

        scrollTilTopp();
    }, [pathname]);

    return null;
}
