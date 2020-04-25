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
    const { title } = this.props;
    return (
      <>
        {title}
        <div className="term-helper">
          <img
            src="/static/images/icon-info.svg"
            className="info"
            onClick={() => this.changeModalHandler(title)}
          />
          {this.state.modalInfo && (
            <Modal modalClosed={this.ModalCloseHander}>
              <h4>{title}</h4>
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
