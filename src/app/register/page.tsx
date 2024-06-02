'use client';

import Layout from "@/components/layout/layout";
import { useEffect, useState } from "react";
import Button from "@/components/forms/button";
import InputDefault from "@/components/forms/inputDefault";
import '../../styles/form/form.css'
import '../../styles/home/login.css'
import Auth from "@/services/auth";
import { redirect } from "next/navigation";
import NavButton from "@/components/layout/navigationButton";

const registerComp = () => {

    useEffect(()=>{
        const token = sessionStorage.getItem('@token')

        if(!token){
            sessionStorage.setItem('mensagem', `{"mensagem":"Você não possui permissões para acessar essa pagina !","tipo":"danger"}`)
            redirect('/')
        }
        
    },[])

    const auth = new Auth
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const cadastroEvento = async (e: React.FormEvent) => {
        e.preventDefault()

        //requisicao
        const dadosCadastro = {
            name: name,
            email: email,
            password: password,
        };

        const response: any = await auth.cadastro(dadosCadastro);
        const {status, message} = response;
        
        if(status == 1){
            //exibir mensagem de sucesso e redirecionar 
        }else {
            //exibir mensagem de erro
            console.error(message)
        }

    }

    return (
        <Layout>
            {/* <div className="feedback-error" >mensagem de erro aqui</div> */}

            <form className="formBody-login">
                <div className="form-input-box">
                    <h2 className="tittle-login">Cadastrar</h2>
                </div>

                <InputDefault
                    type={'text'}
                    placeholder={'Informe seu Nome'}
                    classe={'form-input-box'}
                    label={'Nome'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName((e.target as HTMLInputElement).value)}
                    value={name}
                />

                <InputDefault
                    type={'email'}
                    placeholder={'Informe seu E-mail'}
                    classe={'form-input-box'}
                    label={'E-mail'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                    value={email}
                />

                <InputDefault
                    type={'password'}
                    placeholder={'Informe sua senha'}
                    classe={'form-input-box'}
                    label={'Senha'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword((e.target as HTMLInputElement).value)}
                    value={password}
                />

                <div className="form-input-box">
                    <Button texto={'Cadastrar'} classe={'button-home'} onclick={cadastroEvento} />
                    <NavButton Url="/usersList" page="form" text="Voltar" type="voltar" />
                </div>
            </form>
        </Layout>
    );
}

export default registerComp;