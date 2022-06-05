import { exec } from "child_process";
import { promisify } from "util";

const universalExec: typeof exec =
  typeof window === "undefined"
    ? exec
    : (((() => {}) as unknown) as typeof exec);
const promisifiedExec = promisify(universalExec);

const isGitDirectory = async () => {
  try {
    await promisifiedExec("git status");
    return true;
  } catch (e) {
    return false;
  }
};

export const getBranch = async () => {
  if (!(await isGitDirectory())) {
    return "unknown";
  }
  const response = await promisifiedExec("git branch --show-current");
  return response.stdout.trim();
};

export const getShortCommitSha = async () => {
  if (!(await isGitDirectory())) {
    return "unknown";
  }
  const response = await promisifiedExec("git rev-parse --short HEAD");
  return response.stdout.trim();
};
