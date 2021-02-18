import Link from "../utils/Link";
export interface Props {
  blockHash: string;
  children?: React.ReactNode;
}

export default ({ blockHash, children }: Props) => (
  <Link href="/blocks/[hash]" as={`/blocks/${blockHash}`}>
    <a className="block-link">
      {children || `${blockHash.substring(0, 7)}...`}
    </a>
  </Link>
);
