export type AssessmentType = "PHQ9" | "GAD7";

export interface IAssessmentAnswer {
  questionNumber: number;
  selectedOptionScore: number;
}

export interface IAssessment {
  id?: string;
  type: AssessmentType;
  answers: IAssessmentAnswer[];
  score?: number;
  notes?: string;
  createdAt?: string;
}

export interface ICreateAssessmentRequest {
  type: AssessmentType;
  answers: IAssessmentAnswer[];
  notes?: string;
}
