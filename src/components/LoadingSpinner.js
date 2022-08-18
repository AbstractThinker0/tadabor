const LoadingSpinner = () => {
  return (
    <div className="d-flex flex-column h-75 align-items-center justify-content-center">
      <div
        className="spinner-border"
        role="status"
        style={{ width: "60px", height: "60px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
