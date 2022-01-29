import React from "react";

import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const override = css`
  display: block;
  margin: 0 auto;
  top: 32vh;
`;

//const colour = "#a5c1e8";

const Loader = () => {
	return(
		<HashLoader color={"#a5c1e8"} loading={true} css={override} size={150}/>
	);
};

export default Loader;