import { ClipLoader } from "react-spinners";

function Loading({ loadingText }) {
  return (
    <div className="loading-wrap">
      <ClipLoader color="#666" size={50} />
      <div className="loading-text">{loadingText}...</div>
    </div>
  );
}

export default Loading;