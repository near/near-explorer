import Link from "../utils/Link";
export interface Props {
  blockHash: string;
  truncate?: boolean;
  children?: React.ReactNode;
}

const BlockLink = ({ blockHash, children, truncate = true }: Props) => (
  <Link href="/blocks/[hash]" as={`/blocks/${blockHash}`}>
    <a>
      {children || (truncate ? `${blockHash.substring(0, 7)}...` : blockHash)}
    </a>
  </Link>
);

export default BlockLink;
