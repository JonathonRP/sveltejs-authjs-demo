export const actions = {
	default: async ({ url, request }) => {
		return { success: true, ...Object.fromEntries(await request.formData()) };
	}
};
