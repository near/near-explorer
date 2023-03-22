import createAccount from "@explorer/frontend/public/static/images/icon-t-acct.svg";
import functionCall from "@explorer/frontend/public/static/images/icon-t-call.svg";
import deployContract from "@explorer/frontend/public/static/images/icon-t-contract.svg";
import deleteAccount from "@explorer/frontend/public/static/images/icon-t-key-delete.svg";
import addKey from "@explorer/frontend/public/static/images/icon-t-key-new.svg";
import stake from "@explorer/frontend/public/static/images/icon-t-stake.svg";
import transfer from "@explorer/frontend/public/static/images/icon-t-transfer.svg";

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
