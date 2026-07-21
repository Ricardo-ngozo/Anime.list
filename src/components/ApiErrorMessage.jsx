function ApiErrorMessage({ title, message }) {
  return (
    <div className="message message--error" role="alert">
      <h2>{title}</h2>
      <p>{message || 'Please check your internet connection.'}</p>
    </div>
  );
}

export default ApiErrorMessage;
