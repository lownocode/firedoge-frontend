// import React from "react"
//
// import "../styles/components/footer.css"
// import { config, socialNetworks } from "../data"
//
// export const Footer = () => {
//     const renderSocialNetworks = socialNetworks.map((network, index) => {
//         return (
//             <a
//                 href={network.link}
//                 target={"_blank"}
//                 key={"network-" + index}
//                 className={"footer-social-network"}
//                 style={{ background: network.color }}
//             >
//                 {network.icon}
//             </a>
//         )
//     })
//
//     return (
//         <div className={"footer-container"}>
//             <div>
//                 <div className={"footer-projectname"}>
//                     {config.footerProjectName}
//                 </div>
//                 <div className={"footer-rights"}>
//                     © {new Date().getFullYear()}. All rights reserved.
//                 </div>
//             </div>
//
//             <div className={"footer-social-networks-container"}>
//                 {renderSocialNetworks}
//             </div>
//         </div>
//     )
// }