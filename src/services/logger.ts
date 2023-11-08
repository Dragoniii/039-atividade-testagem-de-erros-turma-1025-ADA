import pino from "pino";

const logger = pino(
    pino.destination("src/services/pino-logger.log")
);

export default logger;