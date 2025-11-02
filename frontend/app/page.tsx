"use client"
import { useEffect } from "react";

const DefaultPage = () => {

    useEffect(() => {
        window.location.href = "/auth/login";
    })
    
    return ( 
        <div></div>
     );
}
 
export default DefaultPage