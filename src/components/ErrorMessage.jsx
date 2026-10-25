function ErrorMessage({ message, onRetry }) {
  return (
    <div className="message message--error" role="alert">
      <h2>Live search is unavailable.</h2>
      <p>{message || 'Please check your internet connection.'}</p>
      {onRetry && <button className="retry-button" type="button" onClick={onRetry}>Retry live search</button>}
    </div>
  );
}

export default ErrorMessage;
