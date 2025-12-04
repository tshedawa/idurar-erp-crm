import { notification } from 'antd';
import codeMessage from './codeMessage';

const successHandler = (response, options = { notifyOnSuccess: false, notifyOnFailed: true }) => {
  const { data, status } = response;

  // Treat 2xx responses as success
  if (status >= 200 && status < 300) {
    const successText = data?.message || codeMessage[status] || 'Request successful';

    if (options.notifyOnSuccess) {
      notification.config({ duration: 2, maxCount: 2 });
      notification.success({
        message: `Request success`,
        description: successText,
      });
    }
  } else {
    // Treat non-2xx as error
    const errorText = data?.message || codeMessage[status] || 'Request failed';
    if (options.notifyOnFailed) {
      notification.config({ duration: 4, maxCount: 2 });
      notification.error({
        message: `Request error ${status}`,
        description: errorText,
      });
    }
  }
};

export default successHandler;
