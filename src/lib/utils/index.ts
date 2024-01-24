import { dev } from '$app/environment';

export const formatError = (error: unknown): App.Error => {
	if (
		dev &&
		(error instanceof TRPCError || error instanceof TRPCClientError || error instanceof Error) &&
		error.stack
	) {
		if (error.cause && error.cause instanceof ZodError) {
			const fields = Object.keys(error.cause.flatten().fieldErrors);
			const { cause } = error;
			return {
				...{
					cause: fields.length
						? [
								...fields.map((field) => ({
									[field]: (cause.format() as unknown as { [x: string]: { _errors: string[] } })[field],
								})),
						  ]
						: [...cause.issues],
				},
				message: fields.length
					? fields.map((field) => `${cause.flatten().fieldErrors[field]} ${field}`).join(', ')
					: cause.issues.map((issue, indx) => `${issue.message} arg${++indx}`).join(', '),
				code: (error as TRPCError)?.code || undefined,
			};
		}

		return {
			message: error?.message ?? 'Whoops',
		};
	}

	return error as App.Error;
};