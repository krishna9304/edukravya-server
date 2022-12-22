import {
  Date,
  Document,
  Mixed,
  model,
  ObjectId,
  Schema,
  StringSchemaDefinition,
} from "mongoose";

export const CONTENT_TYPE = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  DOC: "DOC",
  IMAGE: "IMAGE",
};
export interface ChatInterface extends Document {
  _id: ObjectId;
  content: String;
  from: Mixed | StringSchemaDefinition | undefined;
  to: Mixed | StringSchemaDefinition | undefined;
  timestamp: Date;
  contentType: String;
  isEncrypted: Boolean;
}

const Chat = new Schema<ChatInterface>({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    default: CONTENT_TYPE.TEXT,
  },
  isEncrypted: { type: Boolean, default: false },
  timestamp: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export default model("chat", Chat);
