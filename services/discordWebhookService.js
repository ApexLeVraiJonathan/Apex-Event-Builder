import axios from 'axios';
import logger from '../utils/logger.js';

export const sendToDiscord = async (webhookUrl, message) => {
  try {
    const response = await axios.post(
      webhookUrl,
      { content: message },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    logger.info(`Message successfully sent to Discord: ${response.status}`);
    return response.status;
  } catch (error) {
    logger.error(`Error sending message to Discord: ${error.message}`);
    throw error;
  }
};
