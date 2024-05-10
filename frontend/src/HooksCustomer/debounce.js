import { useState, useEffect } from "react";

// Custom hook to debounce a value
// Hook tùy chỉnh để debounce một giá trị
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    // Effect to handle debouncing logic
    // Effect để xử lý logic debounce
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        // Cleanup function to clear the timeout
        // Hàm dọn dẹp để xóa timeout
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // Add delay to the dependency array to handle changes in delay
        // Thêm delay vào mảng dependencies để xử lý thay đổi trong delay
    }, [value]);

    return debouncedValue;
}
