import { ReactNode } from "react"
import { IconProps } from "../types"



export const IconRating = ({width = 28, height = 28}: IconProps): ReactNode => {
    return(
        <svg width={`${width}`} height={`${height}`} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5 5.5H9.5C7.29086 5.5 5.5 7.29086 5.5 9.5V18.5C5.5 20.7091 7.29086 22.5 9.5 22.5H18.5C20.7091 22.5 22.5 20.7091 22.5 18.5V9.5C22.5 7.29086 20.7091 5.5 18.5 5.5Z" fill="#6BA5E7"/>
            <path d="M11 16.5C11 15.9477 10.5523 15.5 10 15.5C9.44772 15.5 9 15.9477 9 16.5V18.5C9 19.0523 9.44772 19.5 10 19.5C10.5523 19.5 11 19.0523 11 18.5V16.5Z" fill="#286EBF"/>
            <path d="M15 14.5C15 13.9477 14.5523 13.5 14 13.5C13.4477 13.5 13 13.9477 13 14.5V18.5C13 19.0523 13.4477 19.5 14 19.5C14.5523 19.5 15 19.0523 15 18.5V14.5Z" fill="#286EBF"/>
            <path d="M19 12.5C19 11.9477 18.5523 11.5 18 11.5C17.4477 11.5 17 11.9477 17 12.5V18.5C17 19.0523 17.4477 19.5 18 19.5C18.5523 19.5 19 19.0523 19 18.5V12.5Z" fill="#286EBF"/>
            <path d="M13.625 8.5C13.625 5.66954 11.3305 3.375 8.5 3.375C5.66954 3.375 3.375 5.66954 3.375 8.5C3.375 11.3305 5.66954 13.625 8.5 13.625C11.3305 13.625 13.625 11.3305 13.625 8.5Z" fill="#286EBF"/>
            <path d="M13.625 8.5C13.625 5.66954 11.3305 3.375 8.5 3.375C5.66954 3.375 3.375 5.66954 3.375 8.5C3.375 11.3305 5.66954 13.625 8.5 13.625C11.3305 13.625 13.625 11.3305 13.625 8.5Z" stroke="#F5F5F5" stroke-width="1.25"/>
            <path d="M7 10L10 7M10 7H7.5M10 7V9.5" stroke="#F5F5F5" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}