import Slide from "./slide";
import styles from "@/styles/calculator/index.module.css";
import { useContext, useState } from "react";
import { CalculatorContext } from "@/contexts/calculatorContext";
import ListConstantsHeader from "../modal/listConstantsHeader";
import Modal from "@/components/modal";
import { Constant, Reference } from "@/types/cultivarTypes";
import { typeTranslation } from "@/utils/translationsOptions";
import EnvironmentCard from "../environmentCard";
import { env } from "process";

export default function ReferencesSlide() {
	const { filteredReferences: references, selectConstants } =
		useContext(CalculatorContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedReference, setSelectedReference] = useState<Reference | null>(
		null
	);
	const [selectedConstants, setSelectedConstants] = useState<Constant[]>([]);
	const [environmentSelectedId, setEnvironmentSelectedId] = useState("");

	const handleReferenceClick = (reference: Reference) => {
		setSelectedReference(reference);
		setIsModalOpen(true);
	};

	const handleOnCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSelectConstants = (
		environmentId: string,
		constants: Constant[]
	) => {
		setSelectedConstants(constants);
		setEnvironmentSelectedId((prev) =>
			prev === environmentId ? "" : environmentId
		);
	};

	const handleSubmit = () => {
		selectConstants(selectedConstants);
		setIsModalOpen(false);
	};

	return (
		<Slide>
			<Slide.Header
				title="Referências"
				description="Selecione a referência que você quer utilizar como parâmetro para fazer o cálculo."
			>
				<ListConstantsHeader />
			</Slide.Header>
			<Slide.Main>
				{references.length === 0 ? (
					<div className={styles.noReferences}>
						<p>Nenhuma referência encontrada com os critérios selecionados.</p>
						<small>
							Tente ajustar os filtros ou verifique se há dados disponíveis.
						</small>
					</div>
				) : (
					<div className={styles.referencesList}>
						{references.map((reference) => (
							<div
								key={reference.id}
								className={styles.referenceItem}
								onClick={() => handleReferenceClick(reference)}
							>
								<h3>{reference.title}</h3>
								<p>{reference.comment || "Sem descrição"}</p>
								<span>{reference.environments.length} ambiente(s)</span>
							</div>
						))}
					</div>
				)}

				<Modal isOpen={isModalOpen} size="lg">
					<Modal.Header
						title={`Detalhes: ${selectedReference?.title || ""}`}
						description={selectedReference?.comment || ""}
						onClose={handleOnCloseModal}
					/>
					<Modal.Main>
						{selectedReference &&
						selectedReference?.environments?.length > 0 ? (
							<div className={styles.environmentsContainer}>
								{selectedReference.environments.map((envData) => (
									<EnvironmentCard
										key={envData.environment.id}
										envData={envData}
										selected={environmentSelectedId === envData.environment.id}
										handleSelectConstants={() =>
											handleSelectConstants(
												envData.environment.id,
												envData.constants
											)
										}
									/>
								))}
							</div>
						) : (
							<p>Nenhum ambiente disponível nesta referência</p>
						)}
					</Modal.Main>
					<Modal.Footer
						cancelText="Cancelar"
						onCancel={handleOnCloseModal}
						submitText="Confirmar"
						onSubmit={handleSubmit}
					/>
				</Modal>
			</Slide.Main>
		</Slide>
	);
}
