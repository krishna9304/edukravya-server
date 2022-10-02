import {
  Document,
  model,
  ObjectId,
  Schema,
  SchemaDefinitionProperty,
} from "mongoose";

export interface EducationalQualificationInterface {
  title: string;
  description: string;
  files: Array<string>;
  links: Array<string>;
}
export interface PublicationInterface {
  title: string;
  description: string;
  files: Array<string>;
  links: Array<string>;
}
export interface CertificationsInterface {
  title: string;
  description: string;
  files: Array<string>;
  links: Array<string>;
}
export interface ProfessionalExperiencesInterface {
  title: string;
  description: string;
  files: Array<string>;
  links: Array<string>;
}
export interface TestimonialsReceivedInterface {
  title: string;
  description: string;
  featured: boolean;
}

export interface EducatorInterface extends Document {
  _id: ObjectId;
  pitchStatement: string;
  videoElevatorPitch: string;
  educationalQualifications:
    | SchemaDefinitionProperty<EducationalQualificationInterface[]>
    | undefined;
  publications: SchemaDefinitionProperty<PublicationInterface[]> | undefined;
  certifications:
    | SchemaDefinitionProperty<CertificationsInterface[]>
    | undefined;
  professionalExperiences:
    | SchemaDefinitionProperty<ProfessionalExperiencesInterface[]>
    | undefined;
  testimonialsReceived:
    | SchemaDefinitionProperty<TestimonialsReceivedInterface[]>
    | undefined;
  completed: number;
}

const Educator = new Schema<EducatorInterface>({
  pitchStatement: {
    type: String,
    required: false,
  },
  videoElevatorPitch: {
    type: String,
    required: false,
  },
  educationalQualifications: {
    type: Array<EducationalQualificationInterface>,
    required: false,
  },
  publications: {
    type: Array<PublicationInterface>,
    required: false,
  },
  certifications: {
    type: Array<CertificationsInterface>,
    required: false,
  },
  professionalExperiences: {
    type: Array<ProfessionalExperiencesInterface>,
    required: false,
  },
  testimonialsReceived: {
    type: Array<TestimonialsReceivedInterface>,
    required: false,
  },
  completed: {
    type: Number,
    default: 0,
  },
});

export default model("educator", Educator);
