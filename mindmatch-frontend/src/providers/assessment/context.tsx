import { createContext } from "react";
import { IAssessment } from "./types";

export interface IAssessmentStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  assessments?: IAssessment[];
  error?: string | null;
}

export interface IAssessmentActionContext {
  getAll: () => Promise<void>;
  get: (id: number) => Promise<void>;
  create: (data: Partial<IAssessment>) => Promise<void>;
  update: (data: Partial<IAssessment>) => Promise<void>;
  reset: () => void;
}

export const ASSESSMENT_INITIAL_STATE: IAssessmentStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  assessments: [],
  error: null,
};

export const AssessmentStateContext = createContext<IAssessmentStateContext>(ASSESSMENT_INITIAL_STATE);
export const AssessmentActionContext = createContext<IAssessmentActionContext | undefined>(undefined);
