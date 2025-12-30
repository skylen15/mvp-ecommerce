import { authClient } from "@/lib/auth-client";

export const submitForm = ({
    formSelector,
    type = "sign-in",
    redirectUrl = "/",
}: {
    formSelector: string;
    type?: "sign-in" | "sign-up";
    redirectUrl?: string;
}) => {
    const formEl = document.querySelector(formSelector) as HTMLFormElement;

    const submitBtn = formEl.querySelector(
        "button[type='submit']"
    ) as HTMLButtonElement;

    const spinner = formEl.querySelector(".spinner");
    const errEl = formEl.querySelector("#error") as HTMLDivElement;
    const item = errEl.closest("[data-slot='item']") as HTMLDivElement;

    type FetchOpt = Parameters<
        typeof authClient.signIn.email
    >[0]["fetchOptions"];

    const fetchOptions = {
        onError: ({ error }) => {
            if (spinner) {
                spinner.classList.add("hidden");
            }
            submitBtn.disabled = false;
            if (errEl) {
                item?.classList.remove("hidden");
                item?.classList.add("flex");
                errEl.textContent = error.message;
            }
        },
        onSuccess: ({ data }) => {
            if (spinner) {
                spinner.classList.add("hidden");
            }
            submitBtn.disabled = false;
            if (errEl) {
                item?.classList.add("hidden");
            }
            const callbackUrl =
                data?.user?.role === "admin" ? "/admin" : "/dashboard";
            window.location.assign(redirectUrl || callbackUrl);
        },
    } satisfies FetchOpt;

    formEl?.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (submitBtn.disabled) {
            return;
        }

        if (spinner) {
            spinner.classList.remove("hidden");
        }

        submitBtn.disabled = true;
        const formData = new FormData(e.target as HTMLFormElement);

        if (type === "sign-in") {
            await authClient.signIn.email({
                email: formData.get("email")?.toString() || "",
                password: formData.get("password")?.toString() || "",
                fetchOptions,
            });
        } else {
            await authClient.signUp.email({
                name: formData.get("name")?.toString() || "",
                email: formData.get("email")?.toString() || "",
                password: formData.get("password")?.toString() || "",
                fetchOptions,
            });
        }
    });
};
