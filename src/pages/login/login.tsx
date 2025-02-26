import { useAuth } from '../../hooks/useAuth';
import {useNavigate, useSearchParams} from "react-router";
import {Header} from "./../../components/admin/header";
import "./../../components/admin/css/styles.module.scss"
import styles from "../../components/admin/css/styles.module.scss";
import {FormEvent, useEffect} from "react";
import {User} from "../../types";
import {ROLE_ADMIN} from "../../constants";
import {useAppSelector} from "../../hooks/hooks";
import {authState} from "../../slices/auth";

const Login = () => {
    const { user, login } = useAuth();
    const {error, loading} = useAppSelector(authState);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        login({
            login: formData.get("login") as string,
            password: formData.get("password") as string
        } as User);
    }
    function isAccessPermit() {
        return user && user.role === ROLE_ADMIN;
    }
    useEffect(() => {
        if (isAccessPermit()) {
            navigate("/" + searchParams.get("backUrl"));
        }
    }, [user]);
    return (
        <>
            <Header></Header>
            <main>
                <section className={styles["login"]}>
                    <header className={styles["login__header"]}>
                        <h2 className={styles["login__title"]}>Авторизация</h2>
                    </header>
                    <div className={styles["login__wrapper"]}>
                        <div className={styles["text-center"]}>
                            {error ? (<span className={styles["login__input"]} style={{"color": "red", "border": "0px"}}>{error}</span>) : null}
                        </div>
                        <form className={styles["login__form"]} onSubmit={onSubmitForm}>
                            <label className={styles["login__label"]} htmlFor="login">
                                login
                                <input className={styles["login__input"]} type="text" placeholder="login"
                                       name="login" required autoComplete="true"></input>
                            </label>
                            <label className={styles["login__label"]} htmlFor="password">
                                Пароль
                                <input className={styles["login__input"]} type="password" placeholder="" name="password"
                                       required autoComplete="true"></input>
                            </label>
                            <div className={styles["text-center"]}>
                                <input value="Авторизоваться" type="submit" className={styles["login__button"]}></input>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;