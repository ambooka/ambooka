export type NexusResourceKind =
  | "Watch"
  | "Course"
  | "Read"
  | "Reference"
  | "Practice";

export type NexusResourceTuple = readonly [
  title: string,
  kind: NexusResourceKind,
  source: string,
  url: string,
  description: string,
];

export type NexusStudyResource = {
  title: string;
  kind: NexusResourceKind;
  source: string;
  url: string;
  description: string;
};

export type NexusStudyPlan = {
  focus: string;
  resources: NexusStudyResource[];
};
