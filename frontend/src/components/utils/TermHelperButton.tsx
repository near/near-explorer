import { Row } from "react-bootstrap";
import React from "react";

import Modal from "./Modal";

interface Props {
  title: string;
}

interface State {
  modalInfo?: string;
}

export default class extends React.Component<Props, State> {
  state: State = {};

  changeModalHandler = (name: string) => {
    this.setState({ modalInfo: name });
  };

  ModalCloseHander = () => {
    this.setState({ modalInfo: undefined });
  };

  render() {
    return (
      <Row className="term-helper" noGutters>
        <img
          src="/static/images/icon-info.svg"
          className="info"
          onClick={() => this.changeModalHandler(this.props.title)}
        />
        {this.state.modalInfo && (
          <Modal modalClosed={this.ModalCloseHander}>
            {this.props.children}
          </Modal>
        )}
        <style jsx global>{`
          .term-helper {
            display: inline-block;
            width: 14px;
            height: 14px;
            text-transform: none;
          }

          .info {
            display: none;
            vertical-align: text-bottom;
            margin-left: 5px;
            width: 16px;
            cursor: pointer;
          }

          .term-helper:hover .info {
            display: block;
          }

          @media (max-width: 800px) {
            .info {
              display: block;
            }
          }
        `}</style>
      </Row>
    );
  }
}
