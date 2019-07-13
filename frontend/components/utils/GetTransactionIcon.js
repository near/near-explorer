const GetTransactionIcon = {
  Call: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 18 18"
    >
      <path
        fill="#999"
        fillRule="evenodd"
        d="M0 9l6 6L9 0 0 9zm9 9l9-9-6-6-3 15z"
      />
    </svg>
  ),
  Sent: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path fill="#8FD6BD" fillRule="evenodd" d="M6 0v6L0 0v12l6-6v6l6-6z" />
    </svg>
  ),
  Staked: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <g fill="#4A4F54" fillRule="evenodd">
        <path d="M3 6c0-2.22.604-4.153 1.5-5.19C4.058.296 3.547 0 3 0 1.343 0 0 2.686 0 6s1.343 6 3 6c.547 0 1.058-.297 1.5-.81C3.604 10.154 3 8.22 3 6M12 6c0 3.314-1.343 6-3 6S6 9.314 6 6s1.343-6 3-6 3 2.686 3 6" />
      </g>
    </svg>
  ),
  ContractDeployed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path fill="#F0EC74" fillRule="evenodd" d="M0 0v12h12V4H8V0z" />
    </svg>
  )
};

export default GetTransactionIcon;
