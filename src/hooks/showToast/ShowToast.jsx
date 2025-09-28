import toast from "react-hot-toast";
const useToast = () => {
  return {
    success: (message, options = {}) => {
      const fullMessage = options.description
        ? `${message}: ${options.description}`
        : message;
      toast.success(fullMessage, {
        duration: 3000,
        position: "top-right",
      });
    },
    error: (message, options = {}) => {
      const fullMessage = options.description
        ? `${message}: ${options.description}`
        : message;
      toast.error(fullMessage, {
        duration: 5000,
        position: "top-right",
      });
    },
  };
};

export default useToast;
