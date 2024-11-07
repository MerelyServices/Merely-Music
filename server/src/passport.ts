export class PassportLink {
	public url:string;
	private sessions:AuthSessions;

	public constructor(url:string) {
		this.url = url;
		return this;
	}

	public async getProfile(token:string): Promise<false | PassportProfile> {
		// Ensures client is logged in and returns the profile
		if(token in this.sessions) {
			// Use cached token if it meets the security requirements
			if(this.sessions[token].current && this.sessions[token].trusted)
				return this.sessions[token];
			else if(this.sessions[token].current)
				delete this.sessions[token];
			else {
				// Ensure token is still valid
				const result = await fetch(this.url+`/?token=${token}`);
				if(result.ok) {
					this.sessions[token].trusted = true;
					return this.sessions[token];
				}
			}
		}
		if(token.match(/[A-z0-9_-]{21}/)) {
			// Get a new session
			const result = await fetch(this.url+`/account/?token=${token}`);
			if(result.ok) {
				const profile = await result.json() as PassportProfile;
				this.sessions[token] = profile;
				return profile;
			}
		}
		return false;
	}
}

const profileLifetime = (1000 * 60 * 60 * 24); // 24 hours
const trustLifetime = (1000 * 60 * 60 * 30); // 30 minutes
export class PassportProfile {
	public username:string;
	public email:string;
	public verified = false;
	public admin = false;

	private _expiry = Date.now() + profileLifetime;
	private _trust = Date.now() + trustLifetime;

	get current() {
		return this._expiry > Date.now()
	}

	get trusted() {
		return this._trust > Date.now();
	}
	set trusted(val:boolean) {
		this._trust = Date.now() + trustLifetime;
	}
}

interface AuthSessions{
  [key:string]:PassportProfile
}