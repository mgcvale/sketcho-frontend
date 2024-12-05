export const CONFIG = {
    apiBaseUrl: import.meta.env.VITE_API_URL,

    getApiUrl(endpoint: string): string {
        console.log("Serving with base url " + this.apiBaseUrl);
        return `${this.apiBaseUrl}/${endpoint}`
    }
};