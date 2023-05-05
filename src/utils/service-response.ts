export interface ServiceResponse {
	data: any;
	message?: string;
	success: boolean;
}

export const SuccessServiceResponse = (
	data = null,
	message = 'Operation Successfull',
	success = true
): ServiceResponse => {
	return { data, message, success };
};

export const ErrorServiceResponse = (
	data = null,
	message = 'Operation Failed',
	success = false
): ServiceResponse => {
	return { data, message, success };
};
