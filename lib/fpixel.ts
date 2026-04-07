export const FB_PIXEL_ID = '1625870901965014';

export const pageview = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
};

// Esta función es la que usarás para el Punto 3 (Eventos)
export const event = (name: string, options = {}) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', name, options);
    }
};