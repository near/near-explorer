import * as React from "react";

import { useTranslation } from "next-i18next";
import { Modal } from "react-bootstrap";

import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";
import { styled } from "@/frontend/libraries/styles";

const TermHelper = styled("div", {
  display: "inline-block",
  size: 14,
});

export const TermInfoIcon = styled("img", {
  verticalAlign: "text-bottom",
  marginLeft: 5,
  width: 16,
  cursor: "pointer",
});

interface Props {
  title: React.ReactNode;
  text: React.ReactNode;
  href?: string;
}

export const Term: React.FC<Props> = React.memo(({ title, text, href }) => {
  const { t } = useTranslation();
  const [isModalShown, setModalShown] = React.useState(false);
  const track = useAnalyticsTrack();

  const showModal = React.useCallback<React.MouseEventHandler>(
    (e) => {
      e.preventDefault();
      setModalShown(true);
    },
    [setModalShown]
  );
  const hideModal = React.useCallback(() => {
    setModalShown(false);
  }, [setModalShown]);
  const preventClickPropagation = React.useCallback<React.MouseEventHandler>(
    (e) => {
      e.stopPropagation();
    },
    []
  );

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
                rel="noopener noreferrer"
                onClick={() => track("Explorer Docs Click", { href })}
              >
                {t("button.docs")}
              </a>
            )}
          </Modal.Body>
        </Modal>
      </TermHelper>
    </>
  );
});
