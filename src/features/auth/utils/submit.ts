import type { ClientFetchOption } from "better-auth";

import { authClient } from "@/lib/auth-client";

export const submitForm = ({
	formSelector,
	type = "sign-in",
}: {
	formSelector: string;
	type?: "sign-in" | "sign-up";
}) => {
	const formEl = document.querySelector(formSelector) as HTMLFormElement;

	const submitBtn = formEl.querySelector(
		"button[type='submit']",
	) as HTMLButtonElement;

	const spinner = formEl.querySelector(".spinner");
	const errEl = formEl.querySelector("#error") as HTMLDivElement;
	const item = errEl.closest("[data-slot='item']") as HTMLDivElement;

	const fetchOptions = {
		onRequest: () => {
			if (spinner) {
				spinner.classList.remove("hidden");
			}
			submitBtn.disabled = true;
		},
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
		onSuccess: () => {
			if (spinner) {
				spinner.classList.add("hidden");
			}
			submitBtn.disabled = false;
			if (errEl) {
				item?.classList.add("hidden");
			}
			window.location.assign("/");
		},
	} satisfies ClientFetchOption;

	formEl?.addEventListener("submit", async (e) => {
		e.preventDefault();
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
