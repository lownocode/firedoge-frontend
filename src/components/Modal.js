// import React from "react"
// import ReactModal from "react-modal"
//
// import "../styles/components/modal.css"
// import { Close } from "../assets/icons"
//
// export const Modal = (props) => {
//     const {
//         isOpen = false,
//         onClose,
//         children
//     } = props
//
//     return (
//         <ReactModal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             className={"modal-container"}
//             overlayClassName={"modal-overlay"}
//         >
//             <div
//                 className={"modal-close-button"}
//                 onClick={onClose}
//             >
//                 <Close size={20} color={"var(--grey)"} />
//             </div>
//
//             {children}
//         </ReactModal>
//     )
// }