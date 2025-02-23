import { useAuth } from '../../hooks/useAuth';
import {useNavigate, useSearchParams} from "react-router";
import {Header} from "./../../components/admin/header";
import "./../../components/admin/css/styles.module.scss"
import styles from "../../components/admin/css/styles.module.scss";

const Login = () => {
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleLogin = () => {
        login({
            id: 1,
            login: 'John Doe',
            role: "admin"
        });
        navigate("/" + searchParams.get("backUrl"));
    };

    return (
        <>
            <Header></Header>
            <main className={styles["conf-steps"]}>
                <div className={styles["text-center"]}>
                    <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                            onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </main>
        </>
    );
};

export default Login;