import { Component } from "react";

import { Modal } from "react-bootstrap";
import Mixpanel from "../../libraries/mixpanel";

import { Translate } from "react-localize-redux";

interface Props {
  title: string | React.ReactNode;
  text: string | React.ReactNode;
  href?: string;
}

interface State {
  isModalShown: boolean;
}

class Term extends Component<Props, State> {
  state: State = { isModalShown: false };

  preventClickPropagation = (e: any) => {
    e.stopPropagation();
  };

  showModal = (e: any) => {
    e.preventDefault();
    this.setState({ isModalShown: true });
  };

  hideModal = () => {
    this.setState({ isModalShown: false });
  };

  render() {
    const { title, text, href } = this.props;
    return (
      <>
        {title}
        <div className="term-helper" onClick={this.preventClickPropagation}>
          <img
            src="/static/images/icon-info.svg"
            className="info"
            onClick={this.showModal}
          />
          <Modal
            centered
            show={this.state.isModalShown}
            onHide={this.hideModal}
          >
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
                  onClick={() =>
                    Mixpanel.track("Explorer Docs Click", { href: href })
                  }
                >
                  <Translate id="button.docs" />
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
  }
}

export default Term;
