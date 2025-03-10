const LOGIN_KEY = "login";
const PASSWORD_KEY = "password";
export function saveLoginPasswordToLocal(login: string, password: string):void {
    window.localStorage.setItem(LOGIN_KEY, login);
    window.localStorage.setItem(PASSWORD_KEY, password);
}

export function getLoginPasswordFromLocal(): string[] {
    return [window.localStorage.getItem(LOGIN_KEY) || "", window.localStorage.getItem(PASSWORD_KEY) || ""]
}

export function removeLoginPasswordFromLocal(): void {
    window.localStorage.removeItem(LOGIN_KEY);
    window.localStorage.removeItem(PASSWORD_KEY);
}