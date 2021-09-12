import Link from "../utils/Link";
export interface Props {
  blockHash: string;
  trancate?: boolean;
  children?: React.ReactNode;
}

const BlockLink = ({ blockHash, children, trancate = true }: Props) => (
  <Link href="/blocks/[hash]" as={`/blocks/${blockHash}`}>
    <a className="block-link">
      {children || (trancate ? `${blockHash.substring(0, 7)}...` : blockHash)}
    </a>
  </Link>
);

export default BlockLink;
