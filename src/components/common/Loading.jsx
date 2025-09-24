import { ClipLoader } from "react-spinners";
import "../../styles/loading.scss";

function Loading({ loadingText, size = 50 }) {
  return (
    <div className="loading-wrap">
      <ClipLoader color="#666" size={size} />
      <div className="loading-text">{loadingText}...</div>
    </div>
  );
}

export default Loading;
