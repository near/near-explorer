import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { useAnalyticsTrack } from "@explorer/frontend/hooks/analytics/use-analytics-track";
import { CSS, styled } from "@explorer/frontend/libraries/styles";

const Anchor = styled("a", {
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
  ({ onClick: onClickRaw, shallow, css, className, href, ...props }) => {
    const router = useRouter();
    const track = useAnalyticsTrack();
    const isIframe = Boolean(router.query.iframe);
    const onClick = React.useCallback<NonNullable<Props["onClick"]>>(
      (e) => {
        if (!href || isIframe) {
          e.preventDefault();
        }
        track("Explorer Click Link", { href });
        onClickRaw?.(e);
      },
      [onClickRaw, track, href, isIframe]
    );

    const anchor = (
      <Anchor
        onClick={onClick}
        css={css}
        className={className}
        disabled={!href}
      >
        {props.children}
      </Anchor>
    );

    if (!href || isIframe) {
      return anchor;
    }

    return (
      <Link
        shallow={shallow === false ? shallow : true}
        passHref
        href={href}
        {...props}
      >
        {anchor}
      </Link>
    );
  }
);

export default LinkWrapper;
