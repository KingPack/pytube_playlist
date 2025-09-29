export function handleApiError(error) {
  if (error.response) {
    const { status, data } = error.response;
    console.error(`API Error [${status}]:`, data);

    switch (status) {
      case 400:
        alert("Invalid request.");
        break;
      case 404:
        alert("Resource not found.");
        break;
      case 500:
        alert("Internal server error.");
        break;
      default:
        alert("An unexpected error occurred.");
    }
  } else if (error.request) {
    console.error("No response from server:", error.request);
    alert("The server did not respond. Please check your connection.");
  } else {
    console.error("Unexpected error:", error.message);
    alert("Unexpected error. Please try again.");
  }
}
