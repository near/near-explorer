import * as React from "react";
import { CopyToClipboard as RawCopyToClipboard } from "react-copy-to-clipboard";
import { styled } from "../../../libraries/styles";

const Wrapper = styled("div", {
  cursor: "pointer",
  display: "inline-flex",
});

type Props = {
  text: string;
  onCopy?: (text: string, result: boolean) => void;
};

const SHOW_COPY_OK_TIME = 2000;

const CopyToClipboard: React.FC<Props> = React.memo((props) => {
  const [copied, setCopied] = React.useState(false);
  const onCopy = React.useCallback(
    (text, result) => {
      props.onCopy?.(text, result);
      setCopied(true);
    },
    [props.onCopy]
  );
  React.useEffect(() => {
    if (copied) {
      const timeoutId = window.setTimeout(
        () => setCopied(false),
        SHOW_COPY_OK_TIME
      );
      return () => void window.clearTimeout(timeoutId);
    }
  }, [copied]);
  return (
    <Wrapper>
      <RawCopyToClipboard text={props.text} onCopy={onCopy}>
        {copied ? (
          <svg height=".6em" width=".6em" viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
            ></path>
          </svg>
        ) : (
          <svg width=".6em" height=".6em" viewBox="0 0 18 18">
            <path
              d="m11.315 5.9932h-9.7723c-0.85717 0-1.5427 0.63916-1.5427 1.4383v9.1302c0 0.7788 0.68557 1.4383 1.5427 1.4383h9.7931c0.8354 0 1.5427-0.6392 1.5427-1.4383l8e-4 -9.1302c-0.0217-0.79915-0.7073-1.4383-1.5645-1.4383h2e-4zm0.2569 10.549c0 0.1201-0.1071 0.22-0.236 0.22l-9.793-7e-4c-0.12891 0-0.23606-0.0999-0.23606-0.2201l8.3e-4 -9.11c0-0.12018 0.10715-0.22009 0.23607-0.22009h9.793c0.1289 0 0.2361 0.0999 0.2361 0.22009l-9e-4 9.1108z"
              fill="currentColor"
            />
            <path
              d="m16.457 1.1984e-4h-9.7723c-0.85718 0-1.5427 0.63916-1.5427 1.4383v3.3566h1.2858v-3.3566c0-0.12019 0.10714-0.22009 0.23606-0.22009h9.793c0.1289 0 0.2361 0.09989 0.2361 0.22009v9.1302c0 0.1202-0.1071 0.2201-0.2361 0.2201h-2.3146v1.1987h2.3146c0.8354 0 1.5428-0.6392 1.5428-1.4383v-9.1108c0-0.79916-0.6856-1.4383-1.5428-1.4383l2e-4 1.1984e-4z"
              fill="currentColor"
            />
          </svg>
        )}
      </RawCopyToClipboard>
    </Wrapper>
  );
});

export default CopyToClipboard;
