import { FC, useCallback, useState } from "react";

import { Modal } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { useAnalyticsTrack } from "../../hooks/analytics/use-analytics-track";

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
      <div className="term-helper" onClick={preventClickPropagation}>
        <img
          src="/static/images/icon-info.svg"
          className="info"
          onClick={showModal}
        />
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
        <style jsx global>{`
          .term-helper {
            display: inline-block;
            width: 14px;
            height: 14px;
          }

          .term-helper .info {
            vertical-align: text-bottom;
            margin-left: 5px;
            width: 16px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
};

export default Term;
