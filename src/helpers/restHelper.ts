export class Info {
  code: number;
  message: string;
  type: string;

  constructor(code: number, message: string, type: string) {
    this.code = code;
    this.message = message;
    this.type = type;
  }

  getArray() {
    return { code: this.code, message: this.message, type: this.type };
  }
  getCode() {
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

export const compareParams = (paramsReq: Array<string>, reqBody: Object) => {
  let errors: Array<String> = [];
  const keys = Object.keys(reqBody);
  paramsReq.forEach((val: string) => {
    if (!keys.includes(val)) errors.push(val);
  });
  return errors;
};
