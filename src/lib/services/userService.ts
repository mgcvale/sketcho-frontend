import { userStore, type LoginData, type UserData } from '../stores/userStore';
import { CONFIG } from '../../config';
import { CookieService } from './cookieService';
import { type ApiResponse, createResponse, createErrorResponse, handleFetchException } from './requests';

function isValidLoginResponse(responseData: unknown): responseData is { accessToken: string } {
    return typeof responseData === 'object' && responseData !== null && 'accessToken' in responseData;
}

function isValidTokenResponse(responseData: unknown): responseData is {accessToken: string, username: string} {
    return typeof responseData === 'object' && responseData !== null && 'accessToken' in responseData && 'username' in responseData;
}

export class UserService {
    async createUser(data: LoginData): Promise<ApiResponse<UserData | null>> {
        let status: number = 0;
        try {
            const response = await fetch(CONFIG.getApiUrl("user/create"), {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            status = response.status;

            if (!response.ok) {
                return createErrorResponse(status, await response.json().catch(() => null));
            }

            const responseData: unknown = await response.json() as {accessToken: string};
            if (!isValidLoginResponse(responseData)) {
                return createErrorResponse(502, "Invalid response from server");
            }

            return createResponse(status, {
                    username: data.username,
                    accessToken: responseData.accessToken,
                    loggedIn: true
                });
        } catch (error) {
            return handleFetchException(error, status);
        }
    }

    async login(data: LoginData): Promise<ApiResponse<UserData | null>> {
        let status: number = 0;
        try {
            const response = await fetch(CONFIG.getApiUrl("user/get_token"), {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            status = response.status;

            if (!response.ok) {
                return createErrorResponse(status, await response.json().catch(() => null));
            }

            const responseData: unknown = await response.json() as {accessToken: string};
            if (!isValidLoginResponse(responseData)) {
                return createErrorResponse(502, "Invalid response from server");
            }

            return createResponse(status, {
                username: data.username,
                accessToken: responseData.accessToken,
                loggedIn: true
            });
        } catch (error) {
            return handleFetchException(error, status);
        }
    }

    async deleteAccount(token: string): Promise<ApiResponse<null>> {
        let status: number = 0;
        try {
            const response = await fetch(CONFIG.getApiUrl("user/delete"), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            status = response.status;

            if (!response.ok) {
                return createErrorResponse(status, await response.json().catch(() => null));
            }
            // no need to parse response here
            return createResponse(status, null);
        } catch (error) {
            return handleFetchException(error, status);
        }
    }

    loadTokenToCookie(token: string): void {
        CookieService.setCookie("accessToken", token, 30);
    }

    loadTokenFromCookie(): string | null {
        return CookieService.getCookie("accessToken");
    }

    async getDataFromCookie(): Promise<ApiResponse<UserData | null>> {
        const cookie: string | null = this.loadTokenFromCookie();
        if (cookie == null) {
            return createErrorResponse(-1, "No cookie");
        }
        
        let status: number = 0;
        try {
            const response = await fetch(CONFIG.getApiUrl("user/get"), {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${cookie}`
                }
            });

            status = response.status;
            if (!response.ok) {
                return createErrorResponse(status, await response.json().catch(() => null));
            }

            const data = await response.json() as {username: string, accessToken: string}
            if (!isValidTokenResponse(data)) {
                return createErrorResponse(502, "Invalid data from server");
            }

            return createResponse(status, {
                accessToken: data.accessToken,
                username: data.username,
                loggedIn: true
            });
        } catch (error) {
            return handleFetchException(error, status);
        }
    }
}

export function isUserData(data: any): data is UserData {
    return data !== null && typeof data.accessToken === 'string';
}