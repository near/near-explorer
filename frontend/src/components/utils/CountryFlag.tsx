import React from "react";
import ReactCountryFlag from "react-country-flag";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { countries } from "country-data";
import { styled } from "../../libraries/styles";

const DefaultCountryFlag = styled("div", {
  display: "inline-block",
  width: "22px",
  lineHeight: "16px",
  backgroundColor: "#f0f0f1",
  color: "#72727a",
  fontSize: "8px",
  textAlign: "center",
});

const CountryFlagWrapper = styled(ReactCountryFlag, {
  width: "22px !important",
  lineHeight: "14px",
});

interface Props {
  countryCode?: string;
  id: string;
  country?: string;
}

const CountryFlag = (props: Props) => {
  // sometimes in 'country' can be actually countryCode
  let countryCode: string | undefined = props.countryCode?.toUpperCase();
  if (!(countryCode! in countries)) {
    const countryAsCountryCode = props.country?.toUpperCase();
    if (countryAsCountryCode! in countries) {
      countryCode = countryAsCountryCode;
    }
  }
  const countryLabel: string | undefined =
    countries[countryCode!]?.name ?? props.country;

  return (
    <>
      {countryLabel ? (
        <OverlayTrigger
          overlay={<Tooltip id={props.id}>{countryLabel}</Tooltip>}
        >
          {countryCode ? (
            <CountryFlagWrapper {...props} svg countryCode={countryCode} />
          ) : (
            <span>
              <DefaultCountryFlag>?</DefaultCountryFlag>
            </span>
          )}
        </OverlayTrigger>
      ) : (
        <DefaultCountryFlag>?</DefaultCountryFlag>
      )}
    </>
  );
};

export default CountryFlag;
