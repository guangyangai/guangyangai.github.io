In data ETL or query operations, API requests are frequently made towards the server. However, servers can be busy or heavily loaded. 
Often in that case, exceptions would be raised and your pipeline would break. Below is a useful retry decorator function that can be 
used to retry the API request if it failed at the first try without breaking your pipeline. 

```
def retry(max_attempts=3, exceptions=()):
    """
    Decorator to retry a function a configurable number of times for
    a configurable list of exception classes. If exceptions is empty,
    retry on all exceptions.

    Args:
        max_attempts: (int) maximum number of times to try the function
        exceptions: (list) of Exception classes to retry on
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            """
            Args:

            """

            num_attempts = 0

            while num_attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logger.exception(e)

                    next_attempt = False

                    for retry_ex in exceptions:
                        if isinstance(e, retry_ex):
                            next_attempt = True
                            break

                    num_attempts += 1

                    if (next_attempt or len(exceptions) == 0) and num_attempts < max_attempts:
                        backoff = 2 ** (num_attempts - 1)
                        logger.info('Failed to call {}, attempt={}, retrying in {} seconds'.format(
                            func.func_name, num_attempts, backoff))
                        time.sleep(backoff)
                    elif num_attempts == max_attempts:
                        logger.info('Failed to call {}, attempt={}, reached max attempts'.format(
                            func.func_name, num_attempts))
                        break

        return wrapper

    return decorator
    ```
