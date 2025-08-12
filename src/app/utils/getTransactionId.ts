export const getTransactionId = () => {
  return `tran-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
