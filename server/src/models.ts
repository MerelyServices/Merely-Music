

class PassportLink {
	public AppId:number;
	public Secret:string;
	public CallbackUrl:string;

	public constructor(appId:number, secret:string, callbackUrl:string) {
		this.AppId = appId;
		this.Secret = secret;
		this.CallbackUrl = callbackUrl;
		return this;
	}
}

class PassportUser {
	public Id:number;
	public Token:string;
	public Username:string;
	public ProfileUrl:string;
	public Email:string;
	public EmailVerified:boolean;
	public Admin:boolean;
	public Banned:boolean;
}

interface AuthSessions{
  [key:string]:PassportUser
}

export { PassportLink, PassportUser, AuthSessions }