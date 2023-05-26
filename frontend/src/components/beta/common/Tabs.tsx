import * as React from "react";

import { Link } from "@/frontend/components/utils/Link";
import { styled } from "@/frontend/libraries/styles";

const PADDING = 36;

const Wrapper = styled("div", {
  paddingTop: PADDING / 2,
});

const TabLabels = styled("div", {
  background: "white",
  padding: 0,
  marginHorizontal: -PADDING,
  display: "flex",
  position: "relative",
  overflowX: "scroll",
});

const TabHeader = styled("div", {
  marginHorizontal: PADDING,
  marginVertical: PADDING / 2,

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
      false: {
        cursor: "pointer",
      },
    },
  },
});

const Tab = styled("div", {
  display: "none",
  marginTop: PADDING / 2,

  variants: {
    selected: {
      true: {
        display: "block",
      },
    },
  },
});

const TabSlider = styled("div", {
  borderWidth: 3,
  borderTopStyle: "solid",
  borderColor: "#3f4246",

  position: "absolute",
  bottom: 8,
  transition: "all 0.2s linear",
});

type BaseTabProps = {
  label: React.ReactNode;
  node: React.ReactNode;
};

type DisabledTabProps = BaseTabProps & {
  id: string;
  disabled: true;
};

type EnabledTabProps<T extends string> = BaseTabProps & {
  id: T;
  disabled?: false;
};

type Props<T extends string> = {
  initialSelectedId?: T;
  buildHref?: (id: T) => string | undefined;
  tabs: (DisabledTabProps | EnabledTabProps<T>)[];
};

export const Tabs = React.memo(<T extends string>(props: Props<T>) => {
  const firstEnabledTab = props.tabs.find((tab) => !tab.disabled);
  const [selectedId, setSelectedId] = React.useState(
    props.initialSelectedId || (firstEnabledTab ?? props.tabs[0]).id
  );
  const oneOrLessTabsEnabled =
    props.tabs.filter((tab) => !tab.disabled).length <= 1;
  const labelsRecordRef = React.useRef<Record<string, HTMLDivElement | null>>(
    {}
  );
  const [sliderPosition, setSliderPosition] = React.useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });
  React.useEffect(() => {
    const selectedLabelRef = labelsRecordRef.current[selectedId];
    if (!selectedLabelRef) {
      return;
    }
    setSliderPosition({
      width: selectedLabelRef.offsetWidth,
      left: selectedLabelRef.offsetLeft,
    });
  }, [selectedId]);

  return (
    <Wrapper>
      {oneOrLessTabsEnabled ? null : (
        <TabLabels>
          {props.tabs.map(({ label, id, disabled }) => {
            const href = disabled ? undefined : props.buildHref?.(id);
            return (
              <TabHeader
                key={id}
                onClick={disabled ? undefined : () => setSelectedId(id)}
                ref={(element) => (labelsRecordRef.current[id] = element)}
                disabled={Boolean(disabled)}
              >
                {href ? <Link href={href}>{label}</Link> : label}
              </TabHeader>
            );
          })}
          <TabSlider style={sliderPosition} />
        </TabLabels>
      )}
      {props.tabs.map(({ node, id }) => (
        <Tab key={id} selected={id === selectedId}>
          {node}
        </Tab>
      ))}
    </Wrapper>
  );
});
