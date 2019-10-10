export interface Transaction {
  hash: string;
  signerId: string;
  receiverId: string;
  blockTimestamp: number;
}

export interface CreateAccount {}

export interface DeleteAccount {}

export interface DeployContract {}

export interface FunctionCall {}

export interface Transfer {
  deposit: string;
}

export interface Stake {
  stake: string;
  public_key: string;
}

export interface AddKey {
  access_key: any;
  public_key: string;
}

export interface DeleteKey {
  public_key: string;
}

export interface Action {
  CreateAccount: CreateAccount;
  DeleteAccount: DeleteAccount;
  DeployContract: DeployContract;
  FunctionCall: FunctionCall;
  Transfer: Transfer;
  Stake: Stake;
  AddKey: AddKey;
  DeleteKey: DeleteKey;
}
