
const useCheckUserAndLoggedIn = () => {
  const currentUser = true;
  const isLoggedIn = true;
  const userType = currentUser?.type;
  const isFreelancerAndLoggedIn =
    isLoggedIn && userType && userType !== "client";
  const isClientAndLoggedIn = isLoggedIn && userType && userType === "client";
  return {
    currentUser,
    isLoggedIn,
    userType,
    isFreelancerAndLoggedIn,
    isClientAndLoggedIn,
  };
};

export default useCheckUserAndLoggedIn;
