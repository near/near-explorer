import { Badge } from "react-bootstrap";

const NearBadge = () => (
  <Badge variant="light" className="near-badge">
    NEAR
    <style jsx global>{`
      .near-badge {
        border: 1px solid #f0f0f1;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        color: #a2a2a8;
        background: transparent;
      }
    `}</style>
  </Badge>
);

export default NearBadge;
