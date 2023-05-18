import createAccount from "@/frontend/public/static/images/icon-t-acct.svg";
import functionCall from "@/frontend/public/static/images/icon-t-call.svg";
import deployContract from "@/frontend/public/static/images/icon-t-contract.svg";
import deleteAccount from "@/frontend/public/static/images/icon-t-key-delete.svg";
import addKey from "@/frontend/public/static/images/icon-t-key-new.svg";
import stake from "@/frontend/public/static/images/icon-t-stake.svg";
import transfer from "@/frontend/public/static/images/icon-t-transfer.svg";

export default {
  createAccount,
  deleteAccount,
  deployContract,
  functionCall,
  transfer,
  stake,
  addKey,
  deleteKey: deleteAccount,
  delegateAction: functionCall,
};
