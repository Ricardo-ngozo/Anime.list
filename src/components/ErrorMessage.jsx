function ErrorMessage({ message }) {
  return (
    <div className="message message--error" role="alert">
      <h2>Unable to load anime.</h2>
      <p>{message || 'Please check your internet connection.'}</p>
    </div>
  );
}

export default ErrorMessage;
