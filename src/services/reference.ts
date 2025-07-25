import { PPL_Constants } from "@/types/conversionFactor";
import {
  IEnvironmentData,
  IReferenceFormData,
  IReviewUpdateData,
  TCultivarConstants,
} from "@/types/cultivarTypes";
import Axios from "./api";

interface CreateReferenceDTO {
  constants: TCultivarConstants[];
  reference: IReferenceFormData;
  environment: IEnvironmentData;
}

export class ReferenceService {
  async createReference(cultivarId: string, referenceData: CreateReferenceDTO) {
    try {
      const { data } = await Axios.post(`/references/${cultivarId}`, {
        ...referenceData,
      });
      return {
        success: true,
        message: "Referência criada com sucesso!",
        action: "back",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
        action: "stay",
      };
    }
  }

  async update(referenceId: string, referenceData: IReferenceFormData) {
    try {
      const { data } = await Axios.put(`/references/${referenceId}`, {
        ...referenceData,
      });
      return {
        data,
        success: true,
        message: "Referência atualizada com sucesso!",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  async getNameOfAll() {
    try {
      const { data } = await Axios.get(`/references/`);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  async findAllByCultivarId(cultivarId: string) {
    try {
      const { data } = await Axios.get(`/references/${cultivarId}`);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  async deleteEnvironment(referenceId: string, environmentId: string, cultivarId: string) {
    try {
      const { data } = await Axios.delete(
        `/environments/${environmentId}/reference/${referenceId}/cultivar/${cultivarId}`,
      );
      return {
        success: true,
        message: "Ambiente deletado com sucesso!",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  async updateEnvironment(
    entities: {
      referenceId: string;
      cultivarId: string;
      environmentId: string;
    },
    environmentData: IEnvironmentData
  ) {
    try {
      const { cultivarId, environmentId, referenceId } = entities;
      const { data } = await Axios.put(
        `/references/${referenceId}/cultivar/${cultivarId}/environment/${environmentId}`,
        {
          ...environmentData,
        }
      );
      return {
        data,
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }

  async updateReview(reviewId: string, updateData: IReviewUpdateData) {
    try {
      const { data } = await Axios.put(`/review/${reviewId}`, {
        ...updateData,
      });
      return {
        data,
        success: true,
        message: "Review atualizada com sucesso!",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  }
}
