import React from "react"

export const Menu = ({ color = "#fff", size = 15 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 24 24"
        >
            <g clipPath="url(#clip0_429_11066)">
                <path
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M3 6h18M3 12h18M3 18h18"
                ></path>
            </g>
            <defs>
                <clipPath id="clip0_429_11066">
                    <path fill={color} d="M0 0H24V24H0z"></path>
                </clipPath>
            </defs>
        </svg>
    )
}