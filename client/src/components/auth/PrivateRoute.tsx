import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../redux/store";
import type { ReactNode } from "react";

interface Props {
    allowedRoles: ("user" | "psychologist" | "admin")[]
    children: ReactNode
}

const PrivateRoute = ({allowedRoles, children}: Props) => {
    const { accessToken, role } = useSelector((state: RootState) => state.auth)
    console.log("private route hit")
    console.log("accessToken in privateRoute: ", accessToken)
    console.log("role in private Route: ", role)
    const location = useLocation()  

    if(!accessToken || !role) {
        console.log("yes its here after signup")
        const path = location.pathname
        console.log("path name: ", path)

        let redirect = '/login?role=user'
        if(path.includes('/admin')) {
            redirect = '/admin/login'
        } else if( path.includes('/psychologist')) {
            redirect = '/login?role=psychologist'
        }

        return <Navigate to={redirect} replace/>
    }

    if (!allowedRoles.includes(role)) {
        console.log("its here...")
        let loginRedirect = "/login?role=user"
        if (role === "admin") {
            loginRedirect = "/admin/login";
        } 
        else if (role === "psychologist") {
            loginRedirect = "/login?role=psychologist";
        } 

        return <Navigate to={loginRedirect} replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;