import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(apiUrl("/api/signup"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message || "User created");
                navigate("/login");

            } else {
                alert(data.message || "Sign up failed");
            }

        } catch (err) {
            console.error("Error connecting to server", err);
        }
    };

    return(
        <div style={{ padding: 20 }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <br />
                <br />

                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <br />
                <br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
