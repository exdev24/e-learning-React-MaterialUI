export interface Identity {
  id: string;
  email: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      session: {
        isChanged: boolean;
        isNew: boolean;
        isPopulated: boolean;
        identity: Identity;
        ref?: string;
        // timestamp, for session renew
        _ts_: number;
      };
    }
  }
}
