import {
  Date,
  Document,
  Mixed,
  model,
  ObjectId,
  Schema,
  StringSchemaDefinition,
} from "mongoose";

const CONTENT_TYPE = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  DOC: "DOC",
};
export interface ChatInterface extends Document {
  _id: ObjectId;
  content: String;
  from: Mixed | StringSchemaDefinition | undefined;
  to: Mixed | StringSchemaDefinition | undefined;
  timestamp: Date;
  contentType: String;
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
  timestamp: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export default model("chat", Chat);
