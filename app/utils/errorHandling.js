export class SessionError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SessionError';
    this.code = code;
  }
}

export const ErrorCodes = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INVALID_SESSION: 'INVALID_SESSION',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  SYNC_FAILED: 'SYNC_FAILED',
};

export const handleSessionError = (error, onError) => {
  console.error('Session error:', error);
  
  switch (error.code) {
    case ErrorCodes.CONNECTION_FAILED:
      onError('Failed to connect to session. Please check your internet connection.');
      break;
    case ErrorCodes.INVALID_SESSION:
      onError('Invalid or expired session. Please rejoin.');
      break;
    case ErrorCodes.PERMISSION_DENIED:
      onError('You do not have permission to perform this action.');
      break;
    case ErrorCodes.SYNC_FAILED:
      onError('Failed to sync with other participants. Please try again.');
      break;
    default:
      onError('An unexpected error occurred. Please try again.');
  }
};