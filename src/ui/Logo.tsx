
import { Link } from "react-router";
import logoImg from "../assets/logo.png";

export const Logo = () => {
    return (
        <Link to="/" className="flex items-center">
            <figure>
                <img src={logoImg} alt="Logo" width={200} />
            </figure>
        </Link>
    )
}
