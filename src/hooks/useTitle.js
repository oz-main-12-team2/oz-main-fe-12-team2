import { useEffect } from "react";

function useTitle(title) {
  useEffect(() => {
    document.title = title ? `LOV2LY | ${title}` : "LOV2LY";
  }, [title]);
}

export default useTitle;