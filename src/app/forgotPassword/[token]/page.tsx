"use client";

import { useState } from "react";
import Layout from "@/components/layout/layout";
import InputDefault from "@/components/forms/inputDefault";
import styles from "@/styles/forgotPassword/resetPassword.module.css";
import { FaUnlockAlt } from "react-icons/fa";
import { useEffect } from "react";
import Auth from "@/services/auth";
import { useRouter, redirect } from "next/navigation";
import { toast } from "react-toastify";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import InputPassword from "@/components/forms/inputPassword";

interface Props {
  params: { token: string };
}

const ResetPassword = ({ params }: Props) => {
  const { token } = params;
  const [screen, setScreen] = useState<"INITIAL" | "SENT">("INITIAL");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const AuthService = new Auth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const handlePass = () => setIsShow(!isShow);

  useEffect(() => {
    const validateToken = async () => {
      const validToken = await AuthService.validateForgotPassowordToken(token);
      if (validToken === "OK") {
        console.log("Token valido:", validToken);
      } else {
        console.log("Token invalido");
        router.replace("/");
        toast.error("Token invalido");
      }
    };
    validateToken();
  }, [token]);

  const otherSubmit = async () => {
    setIsLoading(true);
    const authService = new Auth();
    if (password === confirmPassword) {
      console.log(token);
      const changedPassword = await authService.resetPassword(token, password);
      toast.success("Senha alterada com sucesso");
      router.replace("/");
    } else {
      toast.error("As senhas não coincidem, digite novamente.");
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Insira a nova senha</h1>
        <p className={styles.p}>
          Sua nova senha deve ser diferente da anterior.
        </p>
        <div className={styles.contInp}>
          <InputPassword
            value={password}
            placeholder={"Digite sua senha"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputPassword
            value={confirmPassword}
            placeholder={"Confirme sua senha"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.contButton}>
          <button
            className={styles.button}
            type="button"
            onClick={(e) => otherSubmit()}
            disabled={isLoading}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
