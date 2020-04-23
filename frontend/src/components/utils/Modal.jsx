import React from "react";

export default class extends React.Component {
  render() {
    return (
      <>
        <div className="backdrop" onClick={this.props.modalClosed}></div>
        <div className="Modal">
          <img
            src="/static/images/icon-close.svg"
            className="close"
            onClick={this.props.modalClosed}
          />
          {this.props.children}
        </div>
        <style jsx global>{`
          .backdrop {
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 10;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .Modal {
            position: fixed;
            left: 35%;
            top: 35%;
            z-index: 50;
            text-align: left;
            background-color: #fff;
            width: 340px;
            margin: 0;
            border-radius: 5px;
            box-shadow: 1px 3px 3px 0 rgba(0, 0, 0, 0.2),
              1px 3px 15px 2px rgba(0, 0, 0, 0.2);
            padding: 25px;
            box-sizing: border-box;
          }

          .close {
            width: 20px;
            margin-left: 20px;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }
}
