"use client";

import Layout from "@/components/layout/layout";
import "../../styles/crops/pageCrops.css";
import { cropsService } from "@/services/crops";
import { useCallback, useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";
import Table from "@/components/table/table";
import NavButton from "@/components/layout/navigationButton";
import { dataCropsType } from "@/types/cropsTypes";
import SearchForm from "@/components/forms/SearchForm";
import { toast } from "react-toastify";

interface Props {
  params: { id: string };
}

const Crops = ({ params }: Props) => {
  const [dados, setDados] = useState<dataCropsType[] | any>([]);
  const [filtredData, setFiltredData] = useState<dataCropsType[] | any>([]);
  const router = useRouter();

  const columns = [
    { header: "Nome", accessor: "name" },
    { header: "Nome científico", accessor: "scientificName" },
  ];

  useEffect(() => {
    let session = sessionStorage.getItem("@token");
    if (session != null) {
      const crops = new cropsService(session);

      crops.list().then((response) => {
        setDados(response);
        setFiltredData(response);
      });
    } else {
      toast.error("Você não possui permissões para acessar essa página!");
      redirect("/");
    }
  }, []);

  const handleView = (id: string) => {
    router.push(`/cultivars/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`crops/editCrops/${id}`);
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const token = sessionStorage.getItem("@token");

      if (token) {
        const crops = new cropsService(token);

        try {
          await crops.deleteCrop(id);
          const updatedData = dados.filter(
            (crop: { id: string }) => crop.id !== id
          );
          setDados(updatedData);
          setFiltredData(updatedData);
          toast.success("Cultura removida com sucesso!");
          console.log("Cultura removida");
        } catch (error) {
          console.error("Falha ao deletar cultura:", error);
          toast.success("Algo deu errado ao tentar deletar!");
        }
      } else {
        toast.error("Você não possui permissões para acessar essa página!");
        redirect("/");
      }
    },
    [dados]
  );

  const handleSearch = (search: string) => {
    const filtred = dados.filter((crop: dataCropsType) =>
      crop.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(search);
    setFiltredData(filtred);
  };

  console.log("filtredData", filtredData);

  return (
    <Layout>
      <div className="cropsPage">
        <h2 className="titulo-crops">Lista de culturas</h2>

        <SearchForm placeholder="Pesquisa por nome" onSearch={handleSearch} />

        <div className="container-button-crops">
          <NavButton Url="/home" text={"Voltar"} type="voltar" page="list" />
          <div>
            <NavButton
              Url="/criarCrops"
              text={"Cadastrar Cultura"}
              type="cadastrar"
              page="list"
            />
          </div>
        </div>
        <Table
          data={filtredData}
          columns={columns}
          onView={(id) => handleView(id)}
          onEdit={(id) => handleEdit(id)}
          onDelete={(id) => handleDelete(id)}
          translations={{}}
        />
      </div>
    </Layout>
  );
};

export default Crops;
