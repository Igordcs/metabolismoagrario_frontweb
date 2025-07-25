"use client";

import Layout from "@/components/layout/layout";
import "@/styles/crops/pageCrops.css";
import "@/styles/cultivar/pageCultivar.css";
import InputDefault from "@/components/forms/inputDefault";
import Styles from "@/styles/cultivar/ViewCultivarPage.module.css";
import { useEffect, useState } from "react";
import { cultivarService } from "@/services/cultivar";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth/authContext";
import { CultivarView } from "@/types/cultivarTypes";
import React from "react";
import ReferenceDropdown from "@/components/cultivars/referenceDropdown";
import { ReferenceTablePagination } from "@/components/table/referenceTable";

const ViewCultivar = () => {
  const params = useParams();
  const id =
    typeof params === "object" && params !== null && "id" in params
      ? String((params as any).id)
      : undefined;

  const [cultivar, setCultivar] = useState<CultivarView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [cId, setCId] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const storedCId = localStorage.getItem("tempCId");
    setCId(storedCId);
  }, []);
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const service = new cultivarService();
    const fetchCultivar = async () => {
      try {
        const data = await service.findOne(id);
        setCultivar(data);
      } catch (error) {
        console.error("Erro ao buscar cultivar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCultivar();
  }, [id]);

  return (
    <Layout>
      <div className="cropsPage">
        <h2 className="titulo-crops">
          Detalhes da Cultivar {cultivar && cultivar.name}
        </h2>
        <div className="container-button-crops">
          <Link
            href={`/cultivars/${cId}`}
            onClick={() => {
              router.push(cId? `/cultivars/${cId}` : "/home");
            }}
          >
            <FaChevronLeft color="#000" />
          </Link>
        </div>

        <main className={Styles.cultivarCardContainer}>
          <div className={Styles.cultivarCard}>
            <section className={Styles.infoSection}>
              <h3 className={Styles.sectionTitle}>Informações</h3>
              <div className={Styles.formContainer}>
                <InputDefault
                  classe="form-input-box"
                  label="Nome"
                  placeholder="Nome"
                  value={cultivar ? cultivar.name : ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    console.log(e.target.value)
                  }
                  type={"text"}
                  disabled
                />
              </div>
            </section>

            <section className={Styles.referenceSection}>
              <div className={Styles.sectionHeader}>
                <h3 className={Styles.sectionTitle}>Referências</h3>
                {user && (
                  <div className={Styles.buttonSection}>
                    <Link
                      href={`/createReference/${id}`}
                      className={Styles.headerButton}
                    >
                      Criar Referência
                    </Link>
                  </div>
                )}
              </div>
              <div className={Styles.dropdownsContainer}>
                {cultivar && cultivar.references.length > 0 && id ? (
                  <ReferenceTablePagination
                    data={cultivar.references.map((ref) => ({
                      ...ref,
                      comment: ref.comment ?? "",
                    }))}
                    cultivarId={id}
                    perPage={5}
                  />
                ) : (
                  <p className={Styles.noReferenceTitle}>
                    Nenhuma referência encontrada
                  </p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ViewCultivar;
