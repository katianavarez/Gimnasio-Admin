import { useEffect, useState } from "react"

interface EventoInstalar extends Event {
    prompt: () => Promise<void>,
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstalar() {
    const [evento, setEvento] = useState<EventoInstalar | null>(null);
    
    useEffect(() => {
        const guardar = (e: Event) => {
            e.preventDefault();
            setEvento(e as EventoInstalar)
        };
        const instalada = () => setEvento(null);
        window.addEventListener('beforeinstallprompt', guardar);
        window.addEventListener('appinstalled', instalada);
        return () => {
            window.removeEventListener('beforeinstallprompt', guardar);
            window.removeEventListener('appinstalled', instalada);
        }
    }, [])

    async function instalar() {
        if(!evento) return;
        await evento.prompt();
        await evento.userChoice;
        setEvento(null);
    }

    return { puedeInstalar: evento !== null, instalar };
}