import { FC } from "react"
import './Generation.css'

export const GenBackground: FC = () => {
    return(
        <svg width="auto" height="auto" className="card-group__background--custom" viewBox="0 0 375 356" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.4" filter="url(#filter0_f_3_5941)">
            <circle cx="256" cy="60" r="128" fill="#2688EB"/>
            </g>
            <g opacity="0.4" filter="url(#filter1_f_3_5941)">
            <circle cx="103" cy="312" r="112" fill="#2688EB"/>
            </g>
            <defs>
            <filter id="filter0_f_3_5941" x="0" y="-196" width="512" height="512" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="64" result="effect1_foregroundBlur_3_5941"/>
            </filter>
            <filter id="filter1_f_3_5941" x="-137" y="72" width="480" height="480" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="64" result="effect1_foregroundBlur_3_5941"/>
            </filter>
            </defs>
        </svg>
    )
}