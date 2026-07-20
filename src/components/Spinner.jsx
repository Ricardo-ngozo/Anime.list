function Spinner() {
  return (
    <div className="spinner-container" role="status">
      <div className="spinner" aria-hidden="true"></div>
      <p>Loading anime...</p>
    </div>
  );
}

export default Spinner;
