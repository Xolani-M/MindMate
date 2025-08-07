export type AssessmentType = "PHQ9" | "GAD7";

export interface AssessmentAnswerOption {
  score: number;
  label: string;
}

export interface AssessmentQuestion {
  number: number;
  text: string;
  options: AssessmentAnswerOption[];
}

export const PHQ9_QUESTIONS: AssessmentQuestion[] = [
  {
    number: 1,
    text: "Little interest or pleasure in doing things",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 2,
    text: "Feeling down, depressed, or hopeless",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 3,
    text: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 4,
    text: "Feeling tired or having little energy",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 5,
    text: "Poor appetite or overeating",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 6,
    text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 7,
    text: "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 8,
    text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 9,
    text: "Thoughts that you would be better off dead or of hurting yourself in some way",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
];

export const GAD7_QUESTIONS: AssessmentQuestion[] = [
  {
    number: 1,
    text: "Feeling nervous, anxious or on edge",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 2,
    text: "Not being able to stop or control worrying",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 3,
    text: "Worrying too much about different things",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 4,
    text: "Trouble relaxing",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 5,
    text: "Being so restless that it is hard to sit still",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 6,
    text: "Becoming easily annoyed or irritable",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
  {
    number: 7,
    text: "Feeling afraid as if something awful might happen",
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
  },
];
