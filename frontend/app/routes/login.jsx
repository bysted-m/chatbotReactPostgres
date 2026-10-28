import {
    Form,
    Link,
    redirect,
    useActionData,
    useNavigation,
    useSearchParams,
} from "react-router";
import { supabase } from "../lib/supabase";

export async function clientAction({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    // Supabase sammenligner passwordet med hashen og gemmer et JWT i localStorage
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: "Invalid email or password" };
    }

    return redirect("/");
}

export default function Login() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [searchParams] = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Log in to continue chatting</p>

                {justRegistered && (
                    <div className="success-message">
                        Account created successfully! Please log in.
                    </div>
                )}

                <Form method="post">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {actionData?.error && (
                        <div className="error-message">{actionData.error}</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? "Logging in..." : "Log In"}
                    </button>
                </Form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
}