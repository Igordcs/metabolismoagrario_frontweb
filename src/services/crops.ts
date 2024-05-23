import axios from "axios";
import Axios from "./api";

type CropsParams = {
    name: string
    scientificName: string
}

interface paramsEntradaConstant {
    type: string
    reference: string
    value: number 
    comment: string
}

export class cropsService {
    private token: string | null

    constructor(token: string | null) {
        this.token = token
    }

    async list() {

        if (this.token) {

            return await Axios.get('/crops', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((s) => {
                return s.data
            })

        }
    }

    async create(params: CropsParams) {
        
        //validacao
        const {name, scientificName} = params


        if (this.token) {
            return await Axios.post('/crops', params, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((s) => {
                sessionStorage.setItem('mensagem', `{"mensagem":"Cultura cadastrada com sucesso !","tipo":"success"}`)
                return { status: 1, mensagem: 'Crop created' }
            }).catch((e) => {
                return { status: -1, mensagem: e.response.data.message[0] }
            })
        }

    }

    async findOne(id: string) {

        if (this.token) {

            return await Axios.get(`/crops/${id}`).then((response) => {
                return response.data.crop
            })

        }

    }

    async createConstantOfCrop(idCrop: string, params: paramsEntradaConstant) {
        if (this.token) {

            let constants = {constants: [params]} 
    
            return await Axios.post(`/constants/${idCrop}`,constants,{
                headers:{
                    Authorization: `Bearer ${this.token}`
                }
            }).then((response)=>{
                sessionStorage.setItem('mensagem', `{"mensagem":"Constante criada com sucesso !","tipo":"success"}`)
                return {status: 1, mensagem: 'Constante Criada com sucesso !'}
            }).catch((error)=>{
                return {status: -1, mensagem: error.response.data.message[0]}
            })
        }

    }
}