import { useEffect, useMemo, useRef, useState } from "react";
import { useKakaoAddressSearch } from "../hooks/useKakaoAddressSearch";

function AddressAutoComplete({
    value,                  // 최종 선택된 주소값 (부모의 state: address)
    onChangeValue,          // 부모에서 setAddress
    placeholder = "주소",
    minLength = 2,
    disabled = false,
    className = "",
    inputClassName = "",
    dropdownClassName = "",
    optionClassName = "",
    noResultText = "검색 결과가 없습니다",
    errorText = "",         // 검증 에러 메시지 표시용
}) {
    const [query, setQuery] = useState(value || "");
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const { results, loading, error } = useKakaoAddressSearch(query, { minLength, debounceMs: 350 });

    // 문서 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) {
                setOpen(false);
                setActiveIdx(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 부모 value가 바뀌면 입력창 동기화
    useEffect(() => {
        setQuery(value || "");
    }, [value]);

    // 렌더용 옵션 문자열 가공
    const options = useMemo(() => {
        return (results || []).map((doc) => {
            // 도로명 주소 or 지번 주소 우선순위
            const road = doc?.road_address?.address_name;
            const lot = doc?.address?.address_name;
            const display = road || lot || "";
            return {
                id: `${doc?.x}-${doc?.y}-${display}`, // doc.id가 없을 수 있어 좌표+주소로 키 생성
                display,
                x: doc?.x,
                y: doc?.y,
                raw: doc,
            };
        }).filter(o => !!o.display);
    }, [results]);

    const onSelect = (opt) => {
        onChangeValue?.(opt.display); // 최종 선택값 부모로 전달
        setQuery(opt.display);        // 입력창도 확정값으로
        setOpen(false);
        setActiveIdx(-1);
        // 필요하면 좌표도 부모에 전달하도록 props 확장 가능 (onSelectDetail 등)
    };

    const onKeyDown = (e) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((prev) => (prev + 1) % Math.max(options.length, 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((prev) => (prev - 1 + Math.max(options.length, 1)) % Math.max(options.length, 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIdx >= 0 && options[activeIdx]) {
                onSelect(options[activeIdx]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setActiveIdx(-1);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`address-autocomplete ${className}`}
            style={{ position: "relative" }}
            role="combobox"
            aria-expanded={open}
            aria-owns="address-autocomplete-listbox"
            aria-haspopup="listbox"
        >
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                disabled={disabled}
                onChange={(e) => {
                    const v = e.target.value;
                    setQuery(v);
                    setOpen(v.trim().length >= minLength);
                }}
                onFocus={() => {
                    if (query.trim().length >= minLength) setOpen(true);
                }}
                onKeyDown={onKeyDown}
                className={`address-autocomplete-input ${inputClassName}`}
                aria-autocomplete="list"
                aria-controls="address-autocomplete-listbox"
                aria-activedescendant={activeIdx >= 0 && options[activeIdx] ? `addr-opt-${activeIdx}` : undefined}
            />

            {open && (
                <div
                    id="address-autocomplete-listbox"
                    role="listbox"
                    className={`address-autocomplete-dropdown ${dropdownClassName}`}
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                    }}
                >
                    {loading && (
                        <div className={`addr-opt ${optionClassName}`} role="option" aria-disabled="true">
                            불러오는 중…
                        </div>
                    )}

                    {!loading && error && (
                        <div className={`addr-opt ${optionClassName}`} role="option" aria-disabled="true">
                            오류: {error}
                        </div>
                    )}

                    {!loading && !error && options.length === 0 && query.trim().length >= minLength && (
                        <div className={`addr-opt ${optionClassName}`} role="option" aria-disabled="true">
                            {noResultText}
                        </div>
                    )}

                    {!loading && !error && options.map((opt, idx) => (
                        <div
                            id={`addr-opt-${idx}`}
                            key={opt.id}
                            role="option"
                            aria-selected={idx === activeIdx}
                            className={`addr-opt ${optionClassName} ${idx === activeIdx ? "is-active" : ""}`}
                            onMouseEnter={() => setActiveIdx(idx)}
                            onMouseDown={(e) => e.preventDefault()} // input blur 방지
                            onClick={() => onSelect(opt)}
                            style={{ cursor: "pointer" }}
                            title={opt.display}
                        >
                            {opt.display}
                        </div>
                    ))}
                </div>
            )}

            {/* 검증 에러 메시지 렌더 (부모에서 내려줌) */}
            {errorText ? (
                <p className="field-error-message" role="alert">
                    {errorText}
                </p>
            ) : null}
        </div>
    )
}

export default AddressAutoComplete;