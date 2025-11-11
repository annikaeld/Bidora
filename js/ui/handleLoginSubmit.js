import { login } from "../api/auth/login.js";
import { save } from "../storage/save.js";

export async function handleLoginSubmit(email, password) {
  try {
    const { response, data } = await login(email, password);

    if (response.ok) {
      const { accessToken, ...profile } = data.data;
      save("token", accessToken);
      save("profile", profile);
    } else {
      //Display errors: data.errors
    }
  } catch (error) {
    console.error("Error:", error);
    //Display: An error occurred. Please try again later.
  }
}
