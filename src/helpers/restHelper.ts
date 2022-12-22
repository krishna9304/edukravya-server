export class Info {
  code: number;
  message: string;
  type: string;
  data: any;

  constructor(code: number, message: string, type: string, data: any = null) {
    this.code = code;
    this.message = message;
    this.type = type;
    this.data = data;
  }

  getArray(): {
    code: number;
    message: string;
    type: string;
    data: any;
  } {
    return {
      code: this.code,
      message: this.message,
      type: this.type,
      data: this.data,
    };
  }
  getCode(): number {
    return this.code;
  }
}

interface ResponseTypesInterface {
  _ERROR_: string;
  _INFO_: string;
}
export const ResponseTypes: ResponseTypesInterface = {
  _ERROR_: "ERROR",
  _INFO_: "INFO",
};

export const compareParams: (
  paramsReq: Array<string>,
  reqBody: Object
) => String[] = (paramsReq: Array<string>, reqBody: Object): String[] => {
  let errors: Array<String> = [];
  const keys: string[] = Object.keys(reqBody);
  paramsReq.forEach((val: string): void => {
    if (!keys.includes(val)) errors.push(val);
  });
  return errors;
};
