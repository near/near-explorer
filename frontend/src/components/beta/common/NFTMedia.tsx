import * as React from "react";

import { Img } from "react-image";

import { PaginationSpinner } from "@/frontend/components/utils/PaginationSpinner";
import { styled } from "@/frontend/libraries/styles";

const Image = styled(Img, {
  width: "100%",
});

const FallbackImage = styled(Image);

const getVideoState = (mediaUrl: string) => {
  let mimeType;
  // check mediaUrl string for .webm or .mp4 endings (case-insensitive)
  if (mediaUrl.match(/\.webm$/i)) mimeType = "webm";
  else if (mediaUrl.match(/\.mp4$/i)) mimeType = "mp4";
  // if there is a mediaUrl and a truthy mimeType (webm or mp4), we have a video
  const isVideo = !!mediaUrl && mimeType;
  return [isVideo, mimeType] as const;
};

type Props = {
  src: string | null;
};
export const NFTMedia: React.FC<Props> = React.memo(({ src }) => {
  const [mediaUrl, setMediaUrl] = React.useState(src ?? null);
  const handleMediaUrl = React.useCallback(
    () => setMediaUrl("/static/images/failed_to_load.svg"),
    [setMediaUrl]
  );
  const [poster, setPoster] = React.useState("");
  const handlePoster = React.useCallback(
    () => setPoster("/static/images/failed_to_load.svg"),
    [setPoster]
  );

  // copied from wallet https://github.com/near/near-wallet/blob/master/packages/frontend/src/components/nft/NFTMedia.js
  const [isVideo, mimeType] = React.useMemo(
    () => (mediaUrl ? getVideoState(mediaUrl) : []),
    [mediaUrl]
  );
  if (!mediaUrl) {
    return <FallbackImage src="/static/images/failed_to_load.svg" />;
  }

  return (
    <>
      {isVideo ? (
        <video muted loop controls autoPlay={false} poster={poster}>
          <source
            src={mediaUrl}
            type={`video/${mimeType}`}
            onError={handlePoster}
          />
        </video>
      ) : (
        <Image
          alt="NFT"
          src={mediaUrl}
          loader={<PaginationSpinner />}
          onError={handleMediaUrl}
        />
      )}
    </>
  );
});
