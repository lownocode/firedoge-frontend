import React from "react"

export const CloseCircle = ({ color = "#fff", size = 15 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
        >
            <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.707 12.293a1 1 0 11-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 12 8.293 9.707a1 1 0 011.414-1.414L12 10.586l2.293-2.293a1 1 0 011.414 1.414L13.414 12z"></path>
        </svg>
    )
}