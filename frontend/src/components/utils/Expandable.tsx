import React from "react";

import { styled } from "@/frontend/libraries/styles";

export type ExpandComponent = React.ComponentType<{
  collapsed: boolean;
  isOverflown: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>;

const Wrapper = styled("div", {
  overflow: "scroll",
  transition: "max-height linear .2s",
});

type Props = {
  children: (ref: React.RefObject<HTMLElement>) => React.ReactNode;
  collapseHeight: number;
  maxHeight?: number;
  dependencies: React.DependencyList;
  expandComponent: ExpandComponent;
};

const Expandable: React.FC<Props> = ({
  children,
  dependencies,
  collapseHeight,
  maxHeight = 99999,
  expandComponent: ExpandComponent,
}) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [height, setHeight] = React.useState<number | undefined>();
  const ref = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    setHeight(Math.round(ref.current.scrollHeight));
    // We need to pass a list of values on change of which we should update collapse height
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...dependencies]);

  return (
    <>
      <Wrapper
        style={collapsed ? { maxHeight: collapseHeight } : { maxHeight }}
      >
        {children(ref)}
      </Wrapper>
      <ExpandComponent
        isOverflown={height ? height >= collapseHeight : false}
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />
    </>
  );
};

export default Expandable;
