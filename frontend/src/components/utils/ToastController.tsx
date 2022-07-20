import React from "react";
import { useToaster, toast, ToastType } from "react-hot-toast";
import { styled } from "../../libraries/styles";

const Wrapper = styled("div");
const Toast = styled("div", {
  width: "100%",
  height: 56,
  display: "flex",
  alignItems: "center",
  padding: "16px 24px",
  backgroundColor: "#D9E9EC",
  color: "#424242",
  cursor: "pointer",

  variants: {
    type: {
      error: {
        background: "#FF004C",
        color: "white",
      },
      warning: {
        background: "#F5B842",
        color: "white",
      },
    },

    last: {
      true: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
    },
  },
});

const Message = styled("span", {
  marginLeft: 20,
});

const getType = (toastType: ToastType): "error" | "warning" | undefined => {
  switch (toastType) {
    case "error":
      return "error";
    case "custom":
      return "warning";
  }
};

export const ToastController: React.FC = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <Wrapper onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts
        .filter((toastInstance) => toastInstance.visible)
        .map((toastInstance, index) => {
          return (
            <Toast
              key={toastInstance.id}
              {...toastInstance.ariaProps}
              last={index === toasts.length - 1}
              type={getType(toastInstance.type)}
              onClick={() => toast.dismiss(toastInstance.id)}
            >
              <svg width="41" height="27" viewBox="0 0 41 27">
                <path
                  d="M33.2195 22.4104H29.4411C28.8946 22.4104 28.4514 21.9672 28.4514 21.4208C28.4514 20.8743 28.8946 20.4292 29.4411 20.4292H33.2195C36.4064 20.5344 39.0751 18.0367 39.1785 14.8515C39.2837 11.6646 36.786 8.99588 33.6008 8.89108L32.9567 8.84788L32.7351 8.24132V8.24319C32.027 6.30892 30.6524 4.692 28.8571 3.67977C27.0636 2.66942 24.9679 2.3314 22.9472 2.72763C20.9246 3.122 19.1124 4.22624 17.8315 5.83942L17.3845 6.40656L16.7065 6.15116C15.9309 5.85445 15.099 5.73989 14.2727 5.81501C12.4981 5.97651 10.9093 6.97935 10.0004 8.51176L9.63982 9.11833L8.95624 8.98311C8.56938 8.90424 8.17314 8.86481 7.77877 8.86293C4.5844 8.86293 1.99481 11.4526 1.99481 14.6469C1.99481 17.8413 4.58449 20.4289 7.77877 20.4289H11.4558C12.0023 20.4289 12.4473 20.874 12.4473 21.4205C12.4473 21.967 12.0023 22.4102 11.4558 22.4102H7.76373C4.99001 22.4102 2.42638 20.9304 1.04085 18.5285C-0.346949 16.1266 -0.346949 13.1671 1.04085 10.7652C2.42677 8.36145 4.99015 6.88164 7.76373 6.88164C8.0642 6.88352 8.36467 6.90042 8.66327 6.9361C9.55343 5.69479 10.8041 4.75578 12.2445 4.24685C13.6849 3.73792 15.2474 3.68345 16.7197 4.0891C18.731 1.84494 21.6022 0.566083 24.6146 0.569832C26.686 0.577344 28.7104 1.18578 30.4419 2.32194C32.1715 3.45999 33.5348 5.07504 34.3649 6.97363C36.9771 7.35674 39.2157 9.04127 40.3066 11.445C41.3976 13.8507 41.1911 16.6449 39.7582 18.8631C38.3235 21.081 35.8615 22.418 33.219 22.4105L33.2195 22.4104Z"
                  fill="currentColor"
                />
                <path
                  d="M27.6376 18.6135C28.6704 17.5825 29.0517 16.067 28.6291 14.6717L26.9352 16.3637C26.7118 16.5985 26.3756 16.6849 26.0657 16.5891L24.892 16.191C24.693 16.1215 24.5371 15.9619 24.4695 15.7628L24.0657 14.5947C23.9681 14.283 24.0563 13.943 24.2911 13.7196L25.9831 12.0276H25.985C24.5333 11.5994 22.9671 12.0351 21.9455 13.1506C20.9239 14.2642 20.6253 15.8642 21.1774 17.2727L13.7257 24.7037C13.5567 24.8708 13.4797 25.1074 13.5154 25.3422C13.5511 25.575 13.6976 25.7779 13.9079 25.8868L15.461 26.6905C15.7464 26.8408 16.0976 26.7863 16.3248 26.5553L23.3785 19.4979C24.847 20.0819 26.5222 19.7326 27.6377 18.6134L27.6376 18.6135Z"
                  fill="currentColor"
                />
              </svg>
              <Message>{toastInstance.message}</Message>
            </Toast>
          );
        })}
    </Wrapper>
  );
};
