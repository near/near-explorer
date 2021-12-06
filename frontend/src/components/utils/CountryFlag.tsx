import React from "react";
import ReactCountryFlag from "react-country-flag";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { countries } from "country-data";

interface Props {
  countryCode?: string;
  id: string;
  country?: string;
}

const DefaultCountryFlag = () => (
  <div
    style={{
      display: "inline-block",
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

const CountryFlag = (props: Props) => {
  // sometimes in 'country' can be actually countryCode
  let countryCode: string | undefined = props.countryCode?.toUpperCase();
  if (countryCode && !(countryCode in countries)) {
    const countryAsCountryCode = props.country?.toUpperCase();
    if (countryAsCountryCode && countryAsCountryCode in countries) {
      countryCode = countryAsCountryCode;
    }
  }
  const countryLabel: string | undefined = countryCode
    ? countries[countryCode]?.name
    : props.country;

  return (
    <>
      {countryLabel ? (
        <OverlayTrigger
          overlay={<Tooltip id={props.id}>{countryLabel}</Tooltip>}
        >
          {countryCode ? (
            <ReactCountryFlag
              {...props}
              svg
              countryCode={countryCode}
              style={{
                width: "22px",
                lineHeight: "14px",
              }}
            />
          ) : (
            <span>
              <DefaultCountryFlag />
            </span>
          )}
        </OverlayTrigger>
      ) : (
        <DefaultCountryFlag />
      )}
    </>
  );
};

export default CountryFlag;
