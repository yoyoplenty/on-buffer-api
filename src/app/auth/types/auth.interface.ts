import { User } from '@on/app/user/model/user.model';

export interface ISharedAuth {
  phone: string;
}

export interface ILogin extends ISharedAuth {
  pin: string;
}

export interface IResetPin extends ISharedAuth {
  pin: string;
  otp: string;
}

export interface IUserToken {
  user: User;
  token: string;
}
