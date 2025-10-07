import { useEffect } from "react";

function useTitle(title) {
  useEffect(() => {
    document.title = title ? `LOV2LY BOOKS | ${title}` : "LOV2LY BOOKS";
  }, [title]);
}

export default useTitle;