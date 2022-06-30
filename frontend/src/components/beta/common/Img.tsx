import * as React from "react";
import Image from "next/image";
import { styled } from "../../../libraries/styles";
import { rgbDataURL } from "../../../libraries/rgbplaceholder";

const FallbackImage = styled("img", {
  width: "100%",
});

type Props = {
  src: string | null;
};
const Img: React.FC<Props> = React.memo(({ src }) => {
  const [mediaUrl, setMediaUrl] = React.useState(src ?? null);
  const handleMediaUrl = React.useCallback(
    (url) => () => setMediaUrl(url),
    [setMediaUrl]
  );

  if (!mediaUrl) {
    return <FallbackImage src="/static/images/failed_to_load.svg" />;
  }

  return (
    <Image
      src={mediaUrl}
      layout="fill"
      placeholder="blur"
      blurDataURL={rgbDataURL(220, 220, 220)}
      onError={handleMediaUrl("/static/images/failed_to_load.svg")}
      onLoadingComplete={handleMediaUrl(src)}
    />
  );
});

export default Img;
