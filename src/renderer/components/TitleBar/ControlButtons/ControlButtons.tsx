export const Close = ({ className, onClick }) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10.56 10.56"
      fontSize={20}
      className={className}
      onClick={onClick}
    >
      <path
        d="M8.71,8l4.42-4.42a.5.5,0,1,0-.71-.71L8,7.29,3.58,2.87a.5.5,0,0,0-.71.71L7.29,8,2.87,12.42a.5.5,0,0,0,0,.71.49.49,0,0,0,.35.15.51.51,0,0,0,.36-.15L8,8.71l4.42,4.42a.51.51,0,0,0,.36.15.49.49,0,0,0,.35-.15.5.5,0,0,0,0-.71Z"
        transform="translate(-2.72 -2.72)"
      />
    </svg>
  );
};

export const Dash = ({ className, onClick }) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10.47 1"
      className={className}
      onClick={onClick}
    >
      <path
        d="M12.74,7.5H3.26a.5.5,0,0,0-.5.5.49.49,0,0,0,.15.35.51.51,0,0,0,.35.15h9.48a.5.5,0,1,0,0-1Z"
        transform="translate(-2.76 -7.5)"
      />
    </svg>
  );
};

export const Maximize = ({ className, onClick }) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10.56 10.56"
      className={className}
      onClick={onClick}
    >
      <path
        d="M11.31,13.28H4.69a2,2,0,0,1-2-2V4.69a2,2,0,0,1,2-2h6.62a2,2,0,0,1,2,2v6.62A2,2,0,0,1,11.31,13.28ZM4.69,3.72a1,1,0,0,0-1,1v6.62a1,1,0,0,0,1,1h6.62a1,1,0,0,0,1-1V4.69a1,1,0,0,0-1-1Z"
        transform="translate(-2.72 -2.72)"
      />
    </svg>
  );
};
