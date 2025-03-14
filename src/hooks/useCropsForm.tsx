import { useState, useEffect } from "react";
import { cropsService } from "@/services/crops";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const useCropsForm = () => {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [name, setName] = useState("");
	const [scientificName, setScientificName] = useState("");
	const [response, setResponse] = useState<1 | -1>(-1);

	useEffect(() => {
		const session = sessionStorage.getItem("@token");
		if (!session) {
		}
	}, []);

	const editarCrop = async (id: string) => {
		if (!name || !scientificName) {
			toast.error(
				"Nome e nome científico são campos obrigatórios para editar uma cultura!"
			);
			return;
		}
		const service = new cropsService();

		const respostaRequisicao = await service.editCrop(id, {
			name,
			scientificName,
		});

		if (respostaRequisicao) {
			const { status } = respostaRequisicao;
			setResponse(status as 1 | -1);
		} else {
			setResponse(-1);
		}
	};

	const cadastroCrops = async () => {
		if (!name) {
			toast.error("Nome é um campo obrigatório para cadastrar uma cultura!", {
				autoClose: 2500,
			});
			return false;
		} else if (!scientificName) {
			toast.error(
				"Nome científico é um campo obrigatório para cadastrar uma cultura!",
				{
					autoClose: 2500,
				}
			);
			return false;
		} else {
			const service = new cropsService();

			const respostaRequisicao = await service.create({
				name,
				scientificName,
			});

			if (respostaRequisicao) {
				const { status } = respostaRequisicao;
				setResponse(status as 1 | -1);
			} else {
				setResponse(-1);
			}
			return true;
		}
	};

	useEffect(() => {
		if (response === 1) {
			redirect("/crops");
		}
	}, [response]);

	return {
		name,
		setName,
		createModalOpen,
		setCreateModalOpen,
		scientificName,
		setScientificName,
		cadastroCrops,
		editarCrop,
	};
};

export default useCropsForm;
