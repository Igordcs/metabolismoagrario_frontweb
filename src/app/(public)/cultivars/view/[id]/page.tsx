"use client";

import Layout from "@/components/layout/layout";
import "@/styles/crops/pageCrops.css";
import "@/styles/cultivar/pageCultivar.css";
import NavButton from "@/components/layout/navigationButton";
import InputDefault from "@/components/forms/inputDefault";
import ReferenceDropdown from "@/components/cultivars/referenceDropdown";
import Styles from "@/styles/cultivar/ViewCultivarPage.module.css";
import { useEffect, useState } from "react";
import { cultivarService } from "@/services/cultivar";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth/authContext";
import { CultivarView } from "@/types/cultivarTypes";

interface Props {
  params: { id: string };
}

const ViewCultivar = ({ params }: Props) => {
  const [cultivar, setCultivar] = useState<CultivarView | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const service = new cultivarService();
    const fetchCultivar = async () => {
      try {
        const data = await service.findOne(params.id);
        setCultivar(data);
      } catch (error) {
        console.error("Erro ao buscar cultivar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCultivar();
  }, [params.id]);

  return (
    <Layout>
      <div className="cropsPage">
        <h2 className="titulo-crops">
          Detalhes da cultivar {cultivar && cultivar.name}
        </h2>
        <div className="container-button-crops">
          <Link href="#" onClick={() => router.back()}>
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
                  <Link
                    href={`/createReference/${params.id}`}
                    className={Styles.headerButton}
                  >
                    Criar Referência
                  </Link>
                )}
              </div>
              <div className={Styles.dropdownsContainer}>
                {cultivar && cultivar.references.length > 0 ? (
                  <>
                    {cultivar.references.map((item, index) => (
                      <ReferenceDropdown
                        title={item.title}
                        environmentData={item.environments}
                        key={`referenceDropDown${index}`}
                      />
                    ))}
                  </>
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
