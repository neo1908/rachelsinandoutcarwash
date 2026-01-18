/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Platform {
			env?: {
				// Add Cloudflare bindings here if needed
			};
		}
	}
}

export {};
