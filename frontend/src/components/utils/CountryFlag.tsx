import React from "react";
import ReactCountryFlag from "react-country-flag";

interface Props {
  countryCode?: string;
}

const DefaultCountryFlag = () => (
  <div
    style={{
      width: "22px",
      lineHeight: "16px",
      backgroundColor: "#f0f0f1",
      color: "#72727a",
      fontSize: "8px",
      textAlign: "center",
    }}
  >
    ?
  </div>
);

const CountryFlag = (props: Props) => (
  <>
    {props.countryCode ? (
      <ReactCountryFlag
        {...props}
        svg
        countryCode={props.countryCode}
        style={{
          width: "22px",
          lineHeight: "14px",
        }}
      />
    ) : (
      <DefaultCountryFlag />
    )}
  </>
);

export default CountryFlag;
