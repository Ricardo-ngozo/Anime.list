function Loader({ label = 'Loading...' }) {
  return (
    <div className="nexus-loader" role="status">
      <span className="nexus-loader__ring" aria-hidden="true"></span>
      <p>{label}</p>
    </div>
  );
}

export default Loader;
