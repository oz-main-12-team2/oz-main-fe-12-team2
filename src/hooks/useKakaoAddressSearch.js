// src/hooks/useKakaoAddressSearch.js
import { useEffect, useRef, useState } from "react";
import kakaoApi from "../api/kakaoApi";

// 간단 캐시 (동일 쿼리 반복 방지)
const cache = new Map();

export function useKakaoAddressSearch(query, { minLength = 2, debounceMs = 350 } = {}) {
    const [results, setResults] = useState([]);         // 주소 후보 목록
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const abortRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // 정리
        if (timerRef.current) clearTimeout(timerRef.current);
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        setError("");
        if (!query || query.trim().length < minLength) {
            setResults([]);
            setLoading(false);
            return;
        }

        // 디바운스
        timerRef.current = setTimeout(async () => {
            try {
                setLoading(true);

                // 캐시 사용
                if (cache.has(query)) {
                    setResults(cache.get(query));
                    setLoading(false);
                    return;
                }

                // AbortController로 이전 요청 취소
                const controller = new AbortController();
                abortRef.current = controller;

                const res = await kakaoApi.get("/search/address.json", {
                    signal: controller.signal,
                    params: {
                        query,
                        analyze_type: "similar",
                        page: 1,
                        size: 10,
                    },
                });

                const docs = res?.data?.documents ?? [];
                cache.set(query, docs);
                setResults(docs);
            } catch (e) {
                if (e.name !== "CanceledError" && e.name !== "AbortError") {
                    // axios 1.x: CanceledError, 표준: AbortError
                    setError(e?.response?.data?.message || e.message || "주소 검색 오류");
                }
            } finally {
                setLoading(false);
                abortRef.current = null;
            }
        }, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (abortRef.current) {
                    abortRef.current.abort();
                    abortRef.current = null;
            }
        };
    }, [query, minLength, debounceMs]);

    return { results, loading, error };
}
