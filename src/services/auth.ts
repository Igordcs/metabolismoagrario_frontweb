
import { loginData,cadastroData } from "@/types/authType";
import Axios from "./api";
class Auth {

    async login(dados:loginData) {
        let retornoReq; 

        await Axios.post('/sessions',dados).then(response =>{       
            sessionStorage.setItem('@token',response.data.accessToken)
            sessionStorage.setItem('@refreshToken',response.data.refreshToken)
            retornoReq = {status: 1, message: 'logado'}
        }).catch(e =>{
            retornoReq = {status: -1, message:e.response.data.message } 
        })

        return retornoReq;
    }

    async cadastro(dados: cadastroData){
        let retornoReq;

        await Axios.post('/users',dados).then(response => {
            retornoReq = {status: 1, message: 'Usuario criado !'}
        }).catch(e =>{
            retornoReq = {status: -1, message:e.response.data.message }
        })

        return retornoReq
    }
}

export default Auth