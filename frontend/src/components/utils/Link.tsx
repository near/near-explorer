import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useAnalyticsTrack } from "@/frontend/hooks/analytics/use-analytics-track";
import { CSS, styled } from "@/frontend/libraries/styles";

const StyledLink = styled(Link, {
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    color: "inherit",
  },

  variants: {
    disabled: {
      true: {
        cursor: "default",
      },
    },
  },
});

type LinkProps = React.ComponentProps<typeof Link>;

type Props = Omit<LinkProps, "href"> & {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  css?: CSS;
  className?: string;
  href?: LinkProps["href"];
};

const LinkWrapper = React.memo<Props>(
  ({
    onClick: onClickRaw,
    shallow = true,
    href,
    prefetch = false,
    ...props
  }) => {
    const router = useRouter();
    const track = useAnalyticsTrack();
    const isIframe = Boolean(router.query.iframe);
    const onClick = React.useCallback<NonNullable<Props["onClick"]>>(
      (e) => {
        if (!href || isIframe) {
          e.preventDefault();
          return;
        }
        track("Explorer Click Link", { href });
        onClickRaw?.(e);
      },
      [onClickRaw, track, href, isIframe]
    );

    return (
      <StyledLink
        passHref
        href={href || ""}
        onClick={onClick}
        disabled={!href || isIframe}
        prefetch={prefetch}
        shallow={shallow}
        {...props}
      >
        {props.children}
      </StyledLink>
    );
  }
);

export default LinkWrapper;
