interface IGetKey {
  LockIndex: number;
  Key: string;
  Flags: number;
  Value: null | any;
  CreateIndex: number;
  ModifyIndex: number;
}

export {IGetKey};
