export { };

declare global {
    interface Window {
        puter: {
            ai: {
                chat: (
                    prompt: string,
                    options?: {
                        model?: string;
                        image?: File | string;
                        temperature?: number;
                    }
                ) => Promise<any>;
            };
        };
    }
}
