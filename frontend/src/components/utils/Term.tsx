import { FC, useCallback, useState } from "react";

import { Modal } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";
import { styled } from "../../libraries/styles";

const TermHelper = styled("div", {
  display: "inline-block",
  width: 14,
  height: 14,
});

export const TermInfoIcon = styled("img", {
  verticalAlign: "text-bottom",
  marginLeft: 5,
  width: 16,
  cursor: "pointer",
});

interface Props {
  title: string | React.ReactNode;
  text: string | React.ReactNode;
  href?: string;
}

const Term: FC<Props> = ({ title, text, href }) => {
  const { t } = useTranslation();
  const [isModalShown, setModalShown] = useState(false);
  const track = useAnalyticsTrack();

  const showModal = useCallback(
    (e) => {
      e.preventDefault();
      setModalShown(true);
    },
    [setModalShown]
  );
  const hideModal = useCallback(() => {
    setModalShown(false);
  }, [setModalShown]);
  const preventClickPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      {title}
      <TermHelper onClick={preventClickPropagation}>
        <TermInfoIcon src="/static/images/icon-info.svg" onClick={showModal} />
        <Modal centered show={isModalShown} onHide={hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {text}{" "}
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                onClick={() => track("Explorer Docs Click", { href: href })}
              >
                {t("button.docs")}
              </a>
            )}
          </Modal.Body>
        </Modal>
      </TermHelper>
    </>
  );
};

export default Term;
