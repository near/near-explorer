import { renderI18nElement } from "../../../libraries/tester";

import StorageSize from "../StorageSize";

describe("<StorageSize />", () => {
  it("bytes renders successfully ", () => {
    expect(renderI18nElement(<StorageSize value={401} />)).toMatchSnapshot();
  });

  it("kilobytes renders successfully ", () => {
    expect(renderI18nElement(<StorageSize value={1727} />)).toMatchSnapshot();
  });

  it("megabytes renders successfully", () => {
    expect(
      renderI18nElement(<StorageSize value={4078008} />)
    ).toMatchSnapshot();
  });

  it("gigabytes renders successfully", () => {
    expect(
      renderI18nElement(<StorageSize value={40780081879} />)
    ).toMatchSnapshot();
  });
});
