
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface RegisterData {
    username: string,
    password: string,
    passwordRepeat: string
}
interface LoginData extends Omit<RegisterData, "passwordRepeat"> { };

export interface AuthResponse {
    data?: string,
    error?: string
}
export interface LoginResponse {
    token?: string,
    error?: string
}
async function register({ username, password, passwordRepeat }: RegisterData): Promise<AuthResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                passwordRepeat
            })
        })
        const data = await response.json();
        if (response.ok) {
            return { data }
        } else {
            return { error: data }
        }

    } catch (error) {
        return { error: "Error de registro" }
    }
}

async function login({ username, password }: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const data = await response.json();
        if (response.ok) {
            return { token:data.token }
        } else {
            return { error: data }
        }
    } catch (error) {
        return { error: "Error de login" }
    }
}

interface FetchOptions {
    method: string;
    headers?: {
        [key: string]: string;
    };
    body?: string;
}

async function fetchWithToken(url:string, options:FetchOptions) {
    const token = localStorage.getItem("token");
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };
    }
    return fetch(url, options);
}


export {
        register,
        login,
        fetchWithToken
    }
