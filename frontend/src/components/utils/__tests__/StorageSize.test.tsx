import StorageSize from "@explorer/frontend/components/utils/StorageSize";
import { renderElement } from "@explorer/frontend/testing/utils";

describe("<StorageSize />", () => {
  it("bytes renders successfully ", () => {
    expect(renderElement(<StorageSize value={401} />)).toMatchSnapshot();
  });

  it("kilobytes renders successfully ", () => {
    expect(renderElement(<StorageSize value={1727} />)).toMatchSnapshot();
  });

  it("megabytes renders successfully", () => {
    expect(renderElement(<StorageSize value={4078008} />)).toMatchSnapshot();
  });

  it("gigabytes renders successfully", () => {
    expect(
      renderElement(<StorageSize value={40780081879} />)
    ).toMatchSnapshot();
  });
});
