import chatModel, { ChatInterface } from "../models/chat.model";

export const ChatFunctions = {
  insert(chatData: ChatInterface): Promise<ChatInterface> {
    return new Promise(
      async (
        resolve: (value: ChatInterface | PromiseLike<ChatInterface>) => void,
        reject: (reason: any) => void
      ): Promise<void> => {
        try {
          const chat: ChatInterface = new chatModel(chatData);
          const chatDoc: ChatInterface = await chat.save();
          resolve(chatDoc);
        } catch (error) {
          reject(error);
        }
      }
    );
  },

  getChats(
    from: String,
    to: String,
    limit: number = 10,
    page: number = 1
  ): Promise<ChatInterface[]> {
    return new Promise(
      async (
        resolve: (
          value: ChatInterface[] | PromiseLike<ChatInterface[]>
        ) => void,
        reject: (reason: any) => void
      ): Promise<void> => {
        try {
          const chats: Array<ChatInterface> = await chatModel
            .find({
              from,
              to,
            })
            .sort({ timestamp: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
          resolve(chats);
        } catch (error) {
          reject(error);
        }
      }
    );
  },

  getDirectMessages(
    from: String,
    limit: number = 20,
    page: number = 1
  ): Promise<Map<any, any>> {
    return new Promise(
      async (
        resolve: (value: Map<any, any> | PromiseLike<Map<any, any>>) => void,
        reject: (reason: any) => void
      ): Promise<void> => {
        try {
          const users = new Map();
          const chats: Array<ChatInterface> = await chatModel
            .find({
              from,
            })
            .sort({ timestamp: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
          for (const chat of chats) {
            users.set(chat.to, {
              timestamp: chat.timestamp,
              lastMessage: chat.content,
            });
          }

          const finalReturnData: any = {};
          users.forEach((value, key) => {
            finalReturnData[key] = value;
          });
          resolve(finalReturnData);
        } catch (error) {
          reject(error);
        }
      }
    );
  },
};
