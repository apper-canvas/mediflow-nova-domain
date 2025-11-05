import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    animate: {
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (type === "table") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            animate="animate"
            className="flex items-center space-x-4"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-100 to-sky-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
              <div className="h-3 w-1/2 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
            </div>
            <div className="h-8 w-20 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            animate="animate"
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-100 to-sky-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
                <div className="h-3 w-1/2 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
              <div className="h-3 w-3/4 rounded bg-gradient-to-r from-cyan-100 to-sky-200" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        variants={containerVariants}
        animate="animate"
        className="flex space-x-2"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;