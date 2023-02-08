import * as React from "react";

import { useTranslation } from "react-i18next";

import Expandable from "@explorer/frontend/components/utils/Expandable";
import { styled } from "@explorer/frontend/libraries/styles";

const Wrapper = styled("div", {
  fontFamily: '"Source Code Pro", monospace',
  background: "#424957",
  color: "white",
  whiteSpace: "pre",
});

const ExpandComponent = styled("div", {
  cursor: "pointer",
  padding: 8,
  background: "inherit",
});

const CodePreviewWrapper = styled("div", {
  padding: 20,
  width: "100%",
  height: "100%",
});

export interface Props {
  value: string;
  collapseHeight: number;
  maxHeight: number;
}

const CodePreview: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Expandable
        collapseHeight={props.collapseHeight}
        expandComponent={({ isOverflown, collapsed, setCollapsed }) =>
          isOverflown ? (
            <ExpandComponent onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? t("button.show_more") : t("button.show_less")}
            </ExpandComponent>
          ) : null
        }
        dependencies={[props.value]}
        maxHeight={props.maxHeight}
      >
        {(ref) => (
          <CodePreviewWrapper ref={ref as React.RefObject<HTMLDivElement>}>
            {props.value}
          </CodePreviewWrapper>
        )}
      </Expandable>
    </Wrapper>
  );
});

export default CodePreview;
