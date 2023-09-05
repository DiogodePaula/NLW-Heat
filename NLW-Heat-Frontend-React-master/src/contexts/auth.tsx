import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../service/api";

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

type AuthProvider = {
    // ReactNode: é qualquer coisa aceitavel pelo react, um texto , 
    // um outro componente, um elemento html qualquer coisa.
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProvider){
    const [user, setUser] = useState<User | null>(null)
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=5510465a4364ede8104c`

    async function signIn(githubCode:string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })
        // token é a informação mais importante para mostrar se um usuario está logado ou não
        const {token, user} = response.data;
        localStorage.setItem('@doWhile:token', token);
        // para o back saber se o usuario que está fazendo as requisições está autenticado ou não
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        setUser(user);        
    }

    function signOut(){
        setUser(null);
        localStorage.removeItem('@doWhile:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@doWhile:token');

        if(token){
            // o axios permite que o token ja parta junto da requisição
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);                
            })
        }
    },[])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes("?code=")

        if(hasGithubCode){
            const [urlWithoutCode, githubCode] = url.split('?code=')
            
            // escode o código da url
            window.history.pushState( {}, '', urlWithoutCode);

            signIn(githubCode);
        }
    },[]);

    return(
        <AuthContext.Provider value={{signInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}