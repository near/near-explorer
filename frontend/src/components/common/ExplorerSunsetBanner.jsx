import React from "react";

import styled from "styled-components";

import { AlertTriangleIcon } from "frontend/src/components/svg/AlertTriangleIcon";

const StyledContainer = styled.div`
  width: 100%;
  background-color: #fff4d5;

  display: flex;
  align-items: flex-start;
  flex-direction: row;
  padding: 15px 0;
  //margin-top: -20px;
  align-items: center;

  .alert-container {
    padding: 9px;
    margin-right: 16px;
    display: flex;
    justify-content: center;
    @media (max-width: 768px) {
      margin: 0 auto 15px;
    }
    .alert-triangle-icon {
      width: 35px;
      height: 35px;
    }
  }

  .message-container {
    display: flex;
    align-items: center;
    justify-content: left;
    flex: 1;
    height: 100%;
    line-height: 1.5;
    width: 80%;
  }
`;

const ContentWrapper = styled.div`
  width: 100%; 
  background-color: #FFF4D5; /
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px; 

  & > *:first-child {
    margin-right: 10px;
  }
 @media (max-width: 992px) {
    padding: 16px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  & .content {
    display: flex;
    align-items: flex-start;
    flex-wrap: none;
    color: #000; 

    > div > span > span > a,
    > div > span > a {
      color: #000; /* Change link color to white */
      text-decoration: underline;
    }
    @media (max-width: 767px) {
      flex-direction: column;
    }

  }
`;

// const IconWrapper = styled.div`
//    display: inline;
//    margin-right: 10px;
//    margin-left: -10px;
// `;
//
// const CloseButton = styled.button`
//    height: 25px;
//    width: 25px;
//    border: none;
//    margin-left: 30px;
//    cursor: pointer;
//    background-color: transparent;
//    padding: 0;
//
//    @media (max-width: 768px) {
//        margin: 15px auto 0;
//    }
// `;

const ExplorerSunsetBanner = () => (
  // const migrationBannerCloseTime = localStorage.getItem('migrationBannerCloseTime');
  // const [showBanner, setShowBanner] = useState(true);
  // const EXPIRY_DATE = 604800000; // 7 days in milliseconds

  //    useEffect(() => {
  //        if (!migrationBannerCloseTime || (Date.now() - migrationBannerCloseTime) > EXPIRY_DATE) {
  //            setShowBanner(true);
  //            localStorage.removeItem('migrationBannerCloseTime');
  //        } else {
  //            setShowBanner(false);
  //        }
  //    }, []);
  //
  //
  //    const hideBanner = () => {
  //        setShowBanner(false);
  //        localStorage.setItem('migrationBannerCloseTime', Date.now());
  //    };

  <StyledContainer id="migration-banner">
    <ContentWrapper>
      <div className="content">
        <div className="alert-container" style={{ marginRight: "10px" }}>
          <AlertTriangleIcon color="#FFA01C" />
        </div>
        <div className="message-container" style={{ whiteSpace: "normal" }}>
          <p>
            As of January 31, 2024, NEAR Explorer will be discontinued. This URL
            will continue to function, but we recommend using{" "}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a href="https://nearblocks.io" target="_blank">
              nearblocks.io
            </a>{" "}
            for your exploration needs. For more details, see our{" "}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a
              href="https://docs.near.org/tools/indexer-for-explorer#near-explorer-sunsetting"
              target="_blank"
            >
              blog post
            </a>
          </p>
        </div>
      </div>
    </ContentWrapper>
  </StyledContainer>
);
export { ExplorerSunsetBanner };
